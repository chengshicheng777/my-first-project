import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'motion/react';

interface HeroProps {
  name: string;
  introPrefix: string;
  introHighlight: string;
  introSuffix: string;
  introLine2: string;
}

const Hero = ({ name, introPrefix, introHighlight, introSuffix, introLine2 }: HeroProps) => {
  return (
    <section className="relative pt-12 pb-6 px-6 overflow-hidden bg-gradient-to-b from-muted to-background">
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center bg-[#d5a2a200] bg-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-4"
        >
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full -z-10 animate-pulse" />
          <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
            <AvatarImage src="https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_142b31e3-5499-4836-8b12-91adc8f58f41.jpg" alt="成橙妈妈" className="object-cover" />
            <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">CC</AvatarFallback>
          </Avatar>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-3"
        >
          {name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-sm md:text-lg text-muted-foreground max-w-2xl leading-relaxed text-left md:text-center md:whitespace-nowrap"
        >
          <span className="block whitespace-nowrap md:inline">
            {introPrefix}
            <span className="text-primary font-medium">{introHighlight}</span>
            {introSuffix}
          </span>
          <span className="block whitespace-nowrap md:inline">{introLine2}</span>
        </motion.p>
      </div>
    </section>
  );
};

export default Hero;
