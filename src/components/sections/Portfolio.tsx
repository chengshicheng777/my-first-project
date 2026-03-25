import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Image as ImageIcon, Eye, Heart, MessageCircle, Trash2, Plus, Upload, X } from 'lucide-react';
import { motion } from 'motion/react';
import { getPortfolioWorks, addPortfolioWork, deletePortfolioWork, uploadPortfolioFile, type PortfolioWork } from '@/db/api';
import { toast } from 'sonner';
import { supabase } from '@/db/supabase';

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'image'>('all');
  const [works, setWorks] = useState<PortfolioWork[]>([]);
  const [loading, setLoading] = useState(true);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  // 上传表单状态
  const [uploadForm, setUploadForm] = useState({
    type: 'image' as 'video' | 'image',
    title: '',
    description: '',
    platform: '小红书' as '小红书' | 'B站',
    tags: '',
    thumbnailFile: null as File | null,
    mediaFile: null as File | null,
  });

  useEffect(() => {
    loadWorks();

    checkOwnerPermission();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkOwnerPermission();
    });
    return () => subscription.unsubscribe();
  }, []);

  const checkOwnerPermission = async () => {
    const ownerId = import.meta.env.VITE_PORTFOLIO_OWNER_ID as string | undefined;
    const ownerEmail = import.meta.env.VITE_PORTFOLIO_OWNER_EMAIL as string | undefined;
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user ?? null;

    if (!user) {
      setIsOwner(false);
      return;
    }

    // 如果你没有在 env 里配置 owner，就把“已登录用户”视为管理员（方便你先快速管理）。
    if (!ownerId && !ownerEmail) {
      setIsOwner(true);
      return;
    }

    const byId = ownerId ? user.id === ownerId : false;
    const byEmail = ownerEmail ? user.email === ownerEmail : false;
    setIsOwner(byId || byEmail);
  };

  const loadWorks = async () => {
    setLoading(true);
    const data = await getPortfolioWorks();
    setWorks(data);
    setLoading(false);
  };

  const filteredWorks = works.filter(work => 
    activeTab === 'all' ? true : work.type === activeTab
  );

  const handleDelete = async (id: string) => {
    if (!isOwner) {
      toast.error('仅管理员可删除作品');
      return;
    }
    if (!confirm('确定要删除这个作品吗？')) return;

    const success = await deletePortfolioWork(id);
    if (success) {
      toast.success('删除成功');
      loadWorks();
    } else {
      toast.error('删除失败，请重试');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'thumbnailFile' | 'mediaFile') => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadForm(prev => ({ ...prev, [field]: file }));
    }
  };

  const handleUpload = async () => {
    if (!isOwner) {
      toast.error('仅管理员可上传作品');
      return;
    }
    if (!uploadForm.title || !uploadForm.description || !uploadForm.thumbnailFile || !uploadForm.mediaFile) {
      toast.error('请填写完整信息并上传文件');
      return;
    }

    setUploading(true);
    try {
      // 上传缩略图
      const thumbnailUrl = await uploadPortfolioFile(uploadForm.thumbnailFile, uploadForm.type);
      if (!thumbnailUrl) throw new Error('缩略图上传失败');

      // 上传媒体文件
      const mediaUrl = await uploadPortfolioFile(uploadForm.mediaFile, uploadForm.type);
      if (!mediaUrl) throw new Error('媒体文件上传失败');

      // 添加作品记录
      const tags = uploadForm.tags.split(',').map(t => t.trim()).filter(Boolean);
      await addPortfolioWork({
        type: uploadForm.type,
        title: uploadForm.title,
        description: uploadForm.description,
        thumbnail_url: thumbnailUrl,
        media_url: mediaUrl,
        platform: uploadForm.platform,
        likes: '0',
        comments: '0',
        tags,
      });

      toast.success('作品上传成功！');
      setIsUploadOpen(false);
      setUploadForm({
        type: 'image',
        title: '',
        description: '',
        platform: '小红书',
        tags: '',
        thumbnailFile: null,
        mediaFile: null,
      });
      loadWorks();
    } catch (error) {
      console.error('上传失败:', error);
      toast.error('上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="py-8 px-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-6"
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <h2 className="text-3xl md:text-4xl font-bold">最近分享</h2>
          {isOwner && (
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="rounded-full">
                  <Plus className="w-4 h-4 mr-1" />
                  上传作品
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>上传新作品</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>作品类型</Label>
                    <Select value={uploadForm.type} onValueChange={(v: 'video' | 'image') => setUploadForm(prev => ({ ...prev, type: v }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="image">图文</SelectItem>
                        <SelectItem value="video">视频</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>标题</Label>
                    <Input
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="输入作品标题"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>描述</Label>
                    <Textarea
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="输入作品描述"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>发布平台</Label>
                    <Select value={uploadForm.platform} onValueChange={(v: '小红书' | 'B站') => setUploadForm(prev => ({ ...prev, platform: v }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="小红书">小红书</SelectItem>
                        <SelectItem value="B站">B站</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>标签（用逗号分隔）</Label>
                    <Input
                      value={uploadForm.tags}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="例如：AI教育,亲子互动,成长记录"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>封面图片</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'thumbnailFile')}
                      />
                      {uploadForm.thumbnailFile && (
                        <Badge variant="secondary">{uploadForm.thumbnailFile.name}</Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{uploadForm.type === 'video' ? '视频文件' : '图片文件'}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept={uploadForm.type === 'video' ? 'video/*' : 'image/*'}
                        onChange={(e) => handleFileChange(e, 'mediaFile')}
                      />
                      {uploadForm.mediaFile && (
                        <Badge variant="secondary">{uploadForm.mediaFile.name}</Badge>
                      )}
                    </div>
                  </div>

                  <Button onClick={handleUpload} disabled={uploading} className="w-full">
                    {uploading ? '上传中...' : '确认上传'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          这里放着我近期的图文和视频，欢迎随便逛逛，也欢迎来和我聊聊你的想法。
        </p>
      </motion.div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mb-6">
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

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">加载中...</div>
      ) : (
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
                <Card className="group relative overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-card">
                  {isOwner && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(work.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}

                  <DialogTrigger asChild>
                    <div className="cursor-pointer">
                      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                        <img 
                          src={work.thumbnail_url} 
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
                    </div>
                  </DialogTrigger>

                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">{work.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                        {work.type === 'video' ? (
                          <video 
                            src={work.media_url}
                            controls
                            className="w-full h-full object-contain bg-black"
                            poster={work.thumbnail_url}
                          >
                            您的浏览器不支持视频播放
                          </video>
                        ) : (
                          <img 
                            src={work.media_url} 
                            alt={work.title}
                            className="w-full h-full object-contain"
                          />
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
                </Card>
              </Dialog>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Portfolio;
