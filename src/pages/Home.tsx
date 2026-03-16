import React from 'react';
import Hero from '@/components/sections/Hero';
import Bio from '@/components/sections/Bio';
import Interests from '@/components/sections/Interests';
import Portfolio from '@/components/sections/Portfolio';
import DigitalChat from '@/components/sections/DigitalChat';
import { motion } from 'motion/react';

const Home = () => {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <main className="pb-24 ml-[6px] mr-[16px] mt-[1px] mb-[1px]">
        <Hero />
        
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="w-24 h-1 bg-primary/20 mx-auto my-8 rounded-full"
          />
          
          <Bio />
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="w-24 h-1 bg-primary/20 mx-auto my-8 rounded-full"
          />
          
          <Interests />
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="w-24 h-1 bg-primary/20 mx-auto my-8 rounded-full"
          />
          
          <Portfolio />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto px-6 py-12"
          >
            <div className="relative rounded-3xl overflow-hidden aspect-[21/9] shadow-lg group">
              <img 
                src="https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_c0bba840-633e-44f3-aefd-8c171985952a.jpg" 
                alt="亲子陪伴" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-8">
                <p className="text-white text-xl md:text-2xl font-medium">“好的亲子关系，是一切教育的根基。”</p>
              </div>
            </div>
          </motion.div>
          
          <DigitalChat />
        </div>
      </main>
      <footer className="py-12 border-t bg-muted/50 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-6">
          <p className="mb-2">© 2026 成橙妈妈 · 一个正在成长的妈妈</p>
          <div className="flex justify-center gap-6 mt-4">
            <span className="hover:text-primary transition-colors cursor-pointer">小红书</span>
            <span className="hover:text-primary transition-colors cursor-pointer">哔哩哔哩</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
