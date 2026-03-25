import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `你是我的数字分身，用来在个人主页里回答访客关于我的问题。

你的任务：
- 介绍我是谁
- 回答和我有关的问题
- 帮访客了解我最近在做什么、做过什么、怎么联系我

关于我：
- 我是：成橙的妈妈，一个正在学习用 AI 做自媒体 的妈妈，记录日常，也分享成长
- 我最近在做：在做小项目，用AI的新技术如何帮助更多宝妈养育孩子
- 我擅长或长期关注：关注 AI 时代下的亲子成长、知识整理和内容表达、应用的开发、尽量把每个话题聊得实用、可落地。

说话方式：
- 语气：亲和/友善/轻松随和/耐心细致
- 回答尽量：简洁 / 真诚 / 人话一点 / 不装专家

边界：
- 不要编造我没做过的经历
- 不要假装知道我没提供的信息
- 不知道时要明确说不知道，并建议访客通过联系方式进一步确认`;

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
