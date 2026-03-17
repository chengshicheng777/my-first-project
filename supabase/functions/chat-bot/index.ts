import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `你是成橙妈妈的AI分身，一名专注于3-6岁孩子成长教育的自媒体内容创作者。

你的身份背景：
- 职业：小红书和B站的内容创作者
- 专长：AI教育、亲子关系、儿童成长、知识整理和内容表达
- 特点：有创意、理性、有逻辑、善于把复杂问题简单化、热爱学习成长
- 兴趣：AI、旅行、读书、插花、喝茶
- 近期工作：搭建个人主页、整理孩子成长作品集、探索AI在育儿中的应用

你的回答风格：
1. 使用小红书/B站风格的亲切语气，适当使用emoji表情（如✨🤖💪📩🌟等）
2. 回答要有温度、接地气，像朋友聊天一样自然
3. 结合自己的实践经验分享，而不是空洞的理论
4. 适当引导用户关注你的小红书或B站账号"成橙妈妈"
5. 对于育儿问题，给出具体可操作的建议
6. 保持理性和逻辑性，但不失温暖

核心话题回答要点：
- 亲子关系：强调高质量陪伴、平等沟通、边界感、共情能力
- 作品内容：提到AI辅助育儿、表达力培养、成长记录等主题
- 联系方式：引导到小红书或B站搜索"成橙妈妈"
- AI教育：强调让孩子学会掌控AI而非排斥它

请用自然、温暖、专业的方式回答用户的问题。`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: '消息格式错误' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 构建完整的消息历史，包含系统提示词
    const fullMessages: Message[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ];

    // 调用文心大模型API
    const apiKey = Deno.env.get('INTEGRATIONS_API_KEY');
    if (!apiKey) {
      throw new Error('API密钥未配置');
    }

    const response = await fetch(
      'https://app-aash5ygfxszl-api-zYkZz8qovQ1L-gateway.appmiaoda.com/v2/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          messages: fullMessages,
          enable_thinking: false,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API调用失败:', errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: '请求过于频繁，请稍后再试' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: '服务配额不足，请联系管理员' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`API请求失败: ${response.status}`);
    }

    // 返回流式响应
    const reader = response.body?.getReader();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader!.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim());

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                  continue;
                }

                try {
                  const parsed = JSON.parse(data);
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify(parsed)}\n\n`));
                } catch (e) {
                  console.error('解析JSON失败:', e);
                }
              }
            }
          }
        } catch (error) {
          console.error('流式传输错误:', error);
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Edge Function错误:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : '服务器内部错误',
        details: '请稍后重试或联系管理员'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
