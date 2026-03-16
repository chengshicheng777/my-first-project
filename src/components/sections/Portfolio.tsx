import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Image as ImageIcon, Eye, Heart, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface WorkItem {
  id: string;
  type: 'video' | 'image';
  title: string;
  description: string;
  thumbnail: string;
  platform: '小红书' | 'B站';
  views?: string;
  likes?: string;
  comments?: string;
  tags: string[];
}

const WORKS_DATA: WorkItem[] = [
  {
    id: '1',
    type: 'video',
    title: '3-6岁孩子如何培养表达力？',
    description: '通过AI工具辅助，让孩子在游戏中学会清晰表达自己的想法。这期视频分享了我和孩子一起实践的3个小技巧。',
    thumbnail: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_23f20b37-a7b2-4cb5-a860-ede1ac8d919f.jpg',
    platform: 'B站',
    views: '2.3万',
    likes: '1.2k',
    comments: '156',
    tags: ['AI教育', '表达力', '亲子互动']
  },
  {
    id: '2',
    type: 'video',
    title: 'AI时代，孩子需要什么能力？',
    description: '深度探讨AI对未来教育的影响，以及我们如何在日常生活中培养孩子的核心竞争力。',
    thumbnail: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_ea7a3615-a9f4-4fb5-beb4-fa68f74a5b87.jpg',
    platform: 'B站',
    views: '5.6万',
    likes: '3.8k',
    comments: '428',
    tags: ['AI教育', '未来能力', '深度思考']
  },
  {
    id: '3',
    type: 'image',
    title: '每日亲子阅读打卡',
    description: '坚持和孩子每天睡前阅读30分钟，记录我们一起读过的绘本和成长瞬间。',
    thumbnail: 'https://miaoda-image.cdn.bcebos.com/img/corpus/5df4dfb5a54644acad73c8fb5fac3f1a.jpg',
    platform: '小红书',
    likes: '8.9k',
    comments: '267',
    tags: ['亲子阅读', '绘本推荐', '成长记录']
  },
  {
    id: '4',
    type: 'image',
    title: '孩子的创意手工作品集',
    description: '整理了孩子这半年的手工作品，每一件都充满了想象力和创造力。',
    thumbnail: 'https://miaoda-image.cdn.bcebos.com/img/corpus/2d2be12dba6a495ab0f660e895fb6c6d.jpg',
    platform: '小红书',
    likes: '6.2k',
    comments: '189',
    tags: ['创意手工', '艺术启蒙', '作品展示']
  },
  {
    id: '5',
    type: 'image',
    title: '周末户外探索日记',
    description: '带孩子走进大自然，在户外活动中培养观察力和探索精神。',
    thumbnail: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_39de34aa-bfc2-4c40-b24d-7470d61bcd39.jpg',
    platform: '小红书',
    likes: '12.5k',
    comments: '342',
    tags: ['户外教育', '自然探索', '亲子时光']
  },
  {
    id: '6',
    type: 'image',
    title: '如何用AI辅助孩子学习？',
    description: '分享我使用AI工具帮助孩子学习的实用方法和心得体会。',
    thumbnail: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_72154655-3fa2-4c9c-a3e6-51fd3ce8cebe.jpg',
    platform: '小红书',
    likes: '15.3k',
    comments: '521',
    tags: ['AI工具', '学习方法', '效率提升']
  },
];

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'image'>('all');

  const filteredWorks = WORKS_DATA.filter(work => 
    activeTab === 'all' ? true : work.type === activeTab
  );

  return (
    <section className="py-16 px-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">我的作品集</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          记录孩子成长的每一个瞬间，分享育儿路上的思考与实践
        </p>
      </motion.div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mb-8">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-muted/50">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            全部作品
          </TabsTrigger>
          <TabsTrigger value="video" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Play className="w-4 h-4 mr-1.5" />
            视频
          </TabsTrigger>
          <TabsTrigger value="image" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <ImageIcon className="w-4 h-4 mr-1.5" />
            图文
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorks.map((work, idx) => (
          <motion.div
            key={work.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
          >
            <Dialog>
              <DialogTrigger asChild>
                <Card className="group cursor-pointer overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-card">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img 
                      src={work.thumbnail} 
                      alt={work.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {work.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-7 h-7 text-primary ml-1" fill="currentColor" />
                        </div>
                      </div>
                    )}

                    <Badge className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm text-primary-foreground border-none">
                      {work.platform}
                    </Badge>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-base mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                      {work.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {work.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      {work.views && (
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {work.views}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        {work.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" />
                        {work.comments}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {work.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-[10px] px-2 py-0.5 bg-muted/80">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>

              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl">{work.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                    <img 
                      src={work.thumbnail} 
                      alt={work.title}
                      className="w-full h-full object-cover"
                    />
                    {work.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="w-20 h-20 rounded-full bg-white/95 flex items-center justify-center shadow-xl">
                          <Play className="w-9 h-9 text-primary ml-1" fill="currentColor" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge className="bg-primary text-primary-foreground">{work.platform}</Badge>
                    <Badge variant="outline">{work.type === 'video' ? '视频作品' : '图文作品'}</Badge>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    {work.views && (
                      <span className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        {work.views} 播放
                      </span>
                    )}
                    <span className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      {work.likes} 点赞
                    </span>
                    <span className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      {work.comments} 评论
                    </span>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2">作品介绍</h4>
                    <p className="text-muted-foreground leading-relaxed">{work.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {work.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Portfolio;
