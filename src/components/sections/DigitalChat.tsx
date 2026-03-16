import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, User, MessageCircle, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PRESET_QUESTIONS = [
  "3-6岁孩子如何建立亲子关系",
  "你现在做了什么？你有哪些作品？",
  "怎么联系上你？",
];

const BOT_DATA = {
  identity: "我是成橙妈妈的数字分身，一名自媒体内容创作人。",
  currentTask: "最近我正在忙着搭建个人主页，并且在用心整理孩子成长的作品集。",
  expertise: "我比较擅长和关心：小红书、B站的内容创作，AI对未来孩子成长的影响，知识整理以及内容表达。",
  answers: {
    "亲子关系": "在3-6岁这个阶段，建立亲子关系的关键在于高质量的陪伴。我们可以通过和孩子一起阅读绘本、进行亲子运动，或者简单地分享日常的点滴来加深情感联结。最重要的是：用心倾听，给予孩子足够的安全感和尊重。",
    "做了什么": "我目前专注于小红书和哔哩哔哩的内容创作。你可以在这两个平台上看到我关于AI教育、孩子成长心得的分享。近期我也在整理孩子这些年的成长点滴，准备做一个系列作品集。",
    "联系": "你可以通过关注我的小红书或B站账号“成橙妈妈”来私信我。如果是商业合作，也可以通过主页预留的联系方式，非常期待能和志同道合的朋友一起交流！",
    "fallback": "这个问题我还在学习中呢。不过你可以尝试问我关于亲子关系、我的作品或者如何联系我的问题哦！"
  }
};

const DigitalChat = () => {
  const [messages, setMessages] = useState<{ role: 'bot' | 'user'; content: string }[]>([
    { role: 'bot', content: "嗨！我是成橙妈妈的数字分身。你想了解关于我的什么信息呢？" }
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
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput("");
    setIsTyping(true);

    // 模拟AI思考
    setTimeout(() => {
      let response = BOT_DATA.answers.fallback;

      const lowerText = text.toLowerCase();
      if (lowerText.includes("亲子") || lowerText.includes("孩子")) {
        response = BOT_DATA.answers["亲子关系"];
      } else if (lowerText.includes("作品") || lowerText.includes("做了什么") || lowerText.includes("整理")) {
        response = BOT_DATA.answers["做了什么"];
      } else if (lowerText.includes("联系") || lowerText.includes("找到你") || lowerText.includes("关注")) {
        response = BOT_DATA.answers["联系"];
      } else if (lowerText.includes("谁") || lowerText.includes("身份") || lowerText.includes("你是")) {
        response = `${BOT_DATA.identity} ${BOT_DATA.currentTask} ${BOT_DATA.expertise}`;
      }

      setMessages(prev => [...prev, { role: 'bot', content: response }]);
      setIsTyping(false);
    }, 800);
  };

  const handleReset = () => {
    setMessages([{ role: 'bot', content: "嗨！我是成橙妈妈的数字分身。你想了解关于我的什么信息呢？" }]);
  };

  return (
    <section className="py-12 px-6 max-w-4xl mx-auto">
      <Card className="border-none shadow-xl overflow-hidden bg-background/80 backdrop-blur-sm">
        <CardHeader className="bg-primary py-4 px-6 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border-2 border-primary-foreground/20">
              <AvatarImage src="https://miaoda-site-img.cdn.bcebos.com/images/MiaoTu_6673fd1e-fd35-4ea6-a26b-03795e6e678f.jpg" alt="成橙妈妈" />
              <AvatarFallback className="bg-white text-primary text-xs">CC</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-primary-foreground text-lg">成橙妈妈数字分身</CardTitle>
              <p className="text-primary-foreground/70 text-xs">正在线为您解答</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleReset} className="text-primary-foreground hover:bg-white/10">
            <RefreshCcw className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-[400px] p-6" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <Avatar className="w-8 h-8 shrink-0 shadow-sm">
                      {msg.role === 'bot' ? (
                        <>
                          <AvatarImage src="https://miaoda-site-img.cdn.bcebos.com/images/MiaoTu_6673fd1e-fd35-4ea6-a26b-03795e6e678f.jpg" />
                          <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">CC</AvatarFallback>
                        </>
                      ) : (
                        <AvatarFallback className="bg-muted text-muted-foreground"><User className="w-4 h-4" /></AvatarFallback>
                      )}
                    </Avatar>
                    <div
                      className={`px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-tr-none'
                          : 'bg-muted text-foreground rounded-tl-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-3 items-center px-4 py-2 bg-muted rounded-2xl rounded-tl-none">
                    <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="p-4 bg-muted/30 flex flex-col gap-4 border-t">
          <div className="flex flex-wrap gap-2 justify-center">
            {PRESET_QUESTIONS.map((q, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                className="text-xs rounded-full border-primary/20 hover:border-primary hover:bg-primary/5 bg-background"
                onClick={() => handleSend(q)}
              >
                {q}
              </Button>
            ))}
          </div>
          <div className="flex w-full gap-2">
            <Input
              placeholder="问问分身关于成橙妈妈的事..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
              className="rounded-full bg-background"
            />
            <Button size="icon" className="rounded-full shrink-0" onClick={() => handleSend(input)}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
};

export default DigitalChat;
