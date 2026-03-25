import React, { useEffect, useState } from 'react';
import Hero from '@/components/sections/Hero';
import Bio from '@/components/sections/Bio';
import Interests from '@/components/sections/Interests';
import Portfolio from '@/components/sections/Portfolio';
import DigitalChat from '@/components/sections/DigitalChat';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { getHomepageContent, type HomepageContent } from '@/db/api';

const Home = () => {
  const defaultContent: HomepageContent = {
    id: 1,
    hero_name: '成橙妈妈',
    hero_intro_prefix: '嗨，我是成橙妈妈。一个正在学习用 ',
    hero_intro_highlight: 'AI 做自媒体',
    hero_intro_suffix: ' 的妈妈，',
    hero_intro_line2: '记录日常，也分享成长。',
    contact_title: '联系方式',
    contact_description: '想快速联系我？点击按钮立即开始聊天（也可直接点右下角「聊聊育儿和 AI」）。',
    contact_button_text: '立即开始联系',
    interests: ['AI', '旅行', '读书', '插花', '喝茶'],
  };

  const [homepageContent, setHomepageContent] = useState<HomepageContent>(defaultContent);

  useEffect(() => {
    getHomepageContent().then((content) => {
      if (content) setHomepageContent(content);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <main className="pb-16 mt-[1px] mb-[1px]">
        <Hero
          name={homepageContent.hero_name}
          introPrefix={homepageContent.hero_intro_prefix}
          introHighlight={homepageContent.hero_intro_highlight}
          introSuffix={homepageContent.hero_intro_suffix}
          introLine2={homepageContent.hero_intro_line2}
        />
        
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="w-24 h-1 bg-primary/20 mx-auto my-4 rounded-full"
          />
          
          <Bio />
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="w-24 h-1 bg-primary/20 mx-auto my-4 rounded-full"
          />
          
          <Interests interests={homepageContent.interests} />
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="w-24 h-1 bg-primary/20 mx-auto my-4 rounded-full"
          />
          
          <Portfolio />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto px-6 py-6"
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

          {/* 快速练习入口：引导访客直接打开右下角 AI 聊天 */}
          <section className="max-w-4xl mx-auto px-6 py-2">
            <div className="rounded-3xl border border-primary/20 bg-muted/20 px-6 py-8 text-center">
              <h2 className="text-xl md:text-2xl font-bold text-primary mb-3">{homepageContent.contact_title}</h2>
              <p className="text-muted-foreground text-sm md:text-base mb-6">
                {homepageContent.contact_description}
              </p>
              <Button
                className="rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  const el = document.getElementById('digital-chat-toggle');
                  el?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
                }}
              >
                {homepageContent.contact_button_text}
              </Button>
            </div>
          </section>
          
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
