import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, User, MessageCircle, X, Minimize2, MessageSquareText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AVATAR_URL = "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_142b31e3-5499-4836-8b12-91adc8f58f41.jpg";

const PRESET_QUESTIONS = [
  "3-6岁孩子如何建立亲子关系？",
  "你最近在忙什么？有哪些作品？",
  "怎么能联系上你？",
];

const BOT_DATA = {
  identity: "我是成橙妈妈的AI分身，一名专注3-6岁孩子成长的内容创作者✨",
  responses: [
    {
      keywords: ["关系", "亲子", "孩子", "教育", "沟通"],
      reply: "哈喽！关于3-6岁孩子的亲子关系，我的心得是：这个阶段的孩子更需要‘平等的陪伴’和‘清晰的边界感’。可以尝试每天空出15分钟的高质量陪伴（放下手机的那种哦！）。我在小红书上也分享过具体的‘共情沟通法’，感兴趣可以关注我看看，一起科学育儿不焦虑~ 💪"
    },
    {
      keywords: ["最近", "忙", "作品", "做", "内容", "什么"],
      reply: "最近我正沉浸在AI育儿的探索中哦！🤖 正在整理一套关于‘AI如何辅助3-6岁孩子表达力’的作品集，也会在B站同步我的学习心得。我的主页上这些模块其实就是我最近的‘成果展示’，希望能带给你一些启发！🌟"
    },
    {
      keywords: ["联系", "合作", "私信", "找到", "关注"],
      reply: "太棒了！很高兴能认识志同道合的朋友。你可以直接在小红书或B站搜索‘成橙妈妈’关注我，那里私信我最快哦！如果是深度交流或内容合作，欢迎私信留言，看到后我会第一时间回复哒~ 📩"
    },
    {
      keywords: ["AI", "未来", "科技"],
      reply: "AI对孩子未来的影响是我非常关注的话题。我认为我们不应该排斥它，而是要教会孩子如何‘掌控’AI。我正在尝试用AI工具为孩子创造更有趣的成长素材，欢迎一起交流探讨！🚀"
    }
  ],
  fallback: "哎呀，这个问题我还在‘进化’中，暂时给不出最完美的答案呢~ 不过你可以问问我关于‘亲子关系’、‘我的近期作品’或者‘如何联系我’，这些我可是很有发言权的！✨"
};

const DigitalChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'bot' | 'user'; content: string }[]>([
    { role: 'bot', content: "嗨！我是成橙妈妈的AI分身。终于等到你啦，想聊聊孩子成长、AI科技或是我的自媒体心得吗？😊" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim() || isTyping) return;

    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let finalReply = BOT_DATA.fallback;
      const lowerText = text.toLowerCase();

      for (const item of BOT_DATA.responses) {
        if (item.keywords.some(kw => lowerText.includes(kw))) {
          finalReply = item.reply;
          break;
        }
      }

      setMessages(prev => [...prev, { role: 'bot', content: finalReply }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full bg-primary text-primary-foreground shadow-2xl transition-all ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageCircle className="w-6 h-6" />
        <span className="ml-2 font-medium hidden md:inline">咨询分身</span>
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
                          {msg.role === 'bot' && (
                            <Avatar className="w-7 h-7 shrink-0 shadow-sm mt-0.5">
                              <AvatarImage src={AVATAR_URL} />
                              <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">CC</AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
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
                    onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
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
