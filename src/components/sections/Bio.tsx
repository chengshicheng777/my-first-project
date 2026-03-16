import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Rocket, Lightbulb, Workflow } from 'lucide-react';
import { motion } from 'motion/react';

const Bio = () => {
  const cards = [
    {
      title: "现在主要在做",
      content: "目前正在搭建个人主页，并用心整理关于3-6岁孩子成长的作品集，在小红书及B站分享育儿智慧。",
      icon: <Rocket className="w-5 h-5 text-accent" />,
      delay: 0.1,
    },
    {
      title: "特色介绍",
      content: "一个有创意，理性，有逻辑，把复杂问题简单化，喜欢学习成长的妈妈。",
      icon: <Lightbulb className="w-5 h-5 text-primary" />,
      delay: 0.2,
    },
    {
      title: "关注领域",
      content: "深耕小红书及B站内容创作，特别关注AI对未来孩子成长的影响、知识整理与深度内容表达。",
      icon: <Brain className="w-5 h-5 text-accent" />,
      delay: 0.3,
    },
    {
      title: "核心价值",
      content: "致力于通过AI与逻辑思考，为家长们提供更具深度的育儿观点，让孩子在AI时代更好地成长。",
      icon: <Workflow className="w-5 h-5 text-primary" />,
      delay: 0.4,
    },
  ];

  return (
    <section className="py-12 px-6 max-w-4xl mx-auto ml-[6px] mr-[6px] mt-[5px] mb-[5px]">
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
