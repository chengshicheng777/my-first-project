import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'motion/react';

const Hero = () => {
  return (
    <section className="relative pt-20 pb-12 px-6 overflow-hidden bg-gradient-to-b from-muted to-background">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-6"
        >
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full -z-10 animate-pulse" />
          <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
            <AvatarImage src="https://miaoda-site-img.cdn.bcebos.com/images/MiaoTu_6673fd1e-fd35-4ea6-a26b-03795e6e678f.jpg" alt="成橙妈妈" className="object-cover" />
            <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">CC</AvatarFallback>
          </Avatar>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-foreground mb-3"
        >
          成橙妈妈
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-lg text-muted-foreground max-w-lg"
        >
          一个正在学习用AI做关于3-6岁孩子成长有关内容的自媒体妈妈
        </motion.p>
      </div>
    </section>
  );
};

export default Hero;
