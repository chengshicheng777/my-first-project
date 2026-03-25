import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/db/supabase';

const AVATAR_URL = "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_142b31e3-5499-4836-8b12-91adc8f58f41.jpg";

const PRESET_QUESTIONS = [
  "3-6岁孩子如何建立亲子关系？",
  "我最近忙些什么？有哪些作品？",
  "怎么联系上我？",
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const DigitalChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "嗨！我是成橙妈妈的AI分身。终于等到你啦，想聊聊孩子成长、AI科技或是我的自媒体心得吗？😊" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      // 准备发送给API的消息历史
      const apiMessages = [...messages, userMessage].map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }));

      // 直接调用Edge Function获取流式响应
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const functionUrl = `${supabaseUrl}/functions/v1/chat-bot`;
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ messages: apiMessages }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API调用失败:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      // 添加一个空的助手消息用于累积内容
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || '';
              
              if (content) {
                accumulatedContent += content;
                setMessages(prev => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = {
                    role: 'assistant',
                    content: accumulatedContent
                  };
                  return newMessages;
                });
              }
            } catch (e) {
              console.error('解析响应失败:', e);
            }
          }
        }
      }

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('请求已取消');
        return;
      }

      console.error('发送消息失败:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '抱歉，我现在有点忙不过来了😅 请稍后再试，或者你可以先看看我主页上的作品集哦！'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        id="digital-chat-toggle"
        className={`fixed bottom-5 right-5 md:bottom-8 md:right-8 z-50 px-4 py-3 rounded-full bg-primary text-primary-foreground shadow-2xl ring-2 ring-white/70 transition-all items-center gap-2 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageCircle className="w-5 h-5" />
        <span className="font-semibold">聊聊育儿和 AI</span>
        <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100, x: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100, x: 50 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[400px] max-h-[600px] shadow-2xl"
          >
            <Card className="border-none overflow-hidden bg-background/95 backdrop-blur-md flex flex-col h-full ring-1 ring-border shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
              <CardHeader className="bg-primary py-3 px-4 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <Avatar className="w-9 h-9 border-2 border-white/20">
                    <AvatarImage src={AVATAR_URL} alt="成橙妈妈" />
                    <AvatarFallback className="bg-white text-primary text-xs">CC</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-primary-foreground text-sm font-semibold">成橙妈妈的AI分身</CardTitle>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-primary-foreground/80 text-[10px]">在线咨询中</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-primary-foreground hover:bg-white/10 h-8 w-8">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0 flex-1 overflow-hidden">
                <ScrollArea className="h-[350px] md:h-[400px] p-4" ref={scrollRef}>
                  <div className="space-y-4 pb-2">
                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex gap-2.5 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                          {msg.role === 'assistant' && (
                            <Avatar className="w-7 h-7 shrink-0 shadow-sm mt-0.5">
                              <AvatarImage src={AVATAR_URL} />
                              <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">CC</AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                              msg.role === 'user'
                                ? 'bg-primary text-primary-foreground rounded-tr-none'
                                : 'bg-muted text-foreground rounded-tl-none border'
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start pl-9">
                        <div className="flex gap-1.5 items-center px-3 py-2 bg-muted rounded-2xl rounded-tl-none">
                          <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                          <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>

              <CardFooter className="p-3 bg-muted/20 flex flex-col gap-3 border-t">
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(q)}
                      disabled={isTyping}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-background border border-primary/20 hover:border-primary hover:bg-primary/5 text-muted-foreground transition-all disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
                <div className="flex w-full gap-2 items-center">
                  <Input
                    placeholder="输入您想问的内容..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend(input)}
                    disabled={isTyping}
                    className="rounded-full bg-background border-primary/20 focus-visible:ring-primary h-9"
                  />
                  <Button 
                    size="icon" 
                    className="rounded-full shrink-0 h-9 w-9" 
                    onClick={() => handleSend(input)}
                    disabled={isTyping || !input.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DigitalChat;
