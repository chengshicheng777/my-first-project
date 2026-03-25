import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Rocket, Lightbulb, Workflow } from 'lucide-react';
import { motion } from 'motion/react';

const Bio = () => {
  const cards = [
    {
      title: "最近在忙什么",
      content: "一边学习 AI 工具，一边整理关于 3-6 岁孩子成长的内容，也会把真实经验分享到小红书和 B 站。",
      icon: <Rocket className="w-5 h-5 text-accent" />,
      delay: 0.1,
    },
    {
      title: "我的风格",
      content: "偏理性、讲逻辑，也愿意把复杂问题讲简单，希望内容既有温度也有方法。",
      icon: <Lightbulb className="w-5 h-5 text-primary" />,
      delay: 0.2,
    },
    {
      title: "我在关注",
      content: "关注 AI 时代下的亲子成长、知识整理和内容表达，尽量把每个话题聊得实用、可落地。",
      icon: <Brain className="w-5 h-5 text-accent" />,
      delay: 0.3,
    },
    {
      title: "我想带来的价值",
      content: "希望通过 AI + 逻辑思考，给家长更多清晰、温和、能立刻用上的育儿思路。",
      icon: <Workflow className="w-5 h-5 text-primary" />,
      delay: 0.4,
    },
  ];

  return (
    <section className="py-8 px-6 max-w-4xl mx-auto mt-[5px] mb-[5px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: card.delay, duration: 0.5 }}
          >
            <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow bg-muted/50">
              <CardHeader className="flex flex-row items-center gap-3 pb-3">
                <div className="p-2 bg-background rounded-full shadow-sm">
                  {card.icon}
                </div>
                <CardTitle className="text-xl">{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {card.content}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Bio;
