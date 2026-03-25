import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/db/supabase';
import { getHomepageContent, updateHomepageContent, type HomepageContent } from '@/db/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const DEFAULT_CONTENT: HomepageContent = {
  id: 1,
  hero_name: '成橙妈妈',
  hero_intro_prefix: '嗨，我是成橙妈妈。一个正在学习用 ',
  hero_intro_highlight: 'AI 做自媒体',
  hero_intro_suffix: ' 的妈妈，',
  hero_intro_line2: '记录日常，也分享成长。',
  contact_title: '联系方式',
  contact_description: '想快速练习我？点击按钮立即开始聊天（也可直接点右下角「聊聊育儿和 AI」）。',
  contact_button_text: '立即开始联系',
  interests: ['AI', '旅行', '读书', '插花', '喝茶'],
};

const AdminManage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<HomepageContent>(DEFAULT_CONTENT);

  const interests = useMemo(() => {
    const list = content.interests ?? [];
    return [list[0] ?? '', list[1] ?? '', list[2] ?? '', list[3] ?? '', list[4] ?? ''];
  }, [content.interests]);

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        navigate('/admin/login', { replace: true });
        return;
      }

      const dbContent = await getHomepageContent();
      if (!cancelled && dbContent) setContent(dbContent);
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('已退出登录');
    navigate('/admin/login', { replace: true });
  };

  const handleSave = async () => {
    if (saving) return;

    if (!content.hero_name.trim()) {
      toast.error('请填写自我介绍标题（成橙妈妈）');
      return;
    }
    if (!content.contact_title.trim()) {
      toast.error('请填写联系方式标题');
      return;
    }

    setSaving(true);
    try {
      await updateHomepageContent({
        hero_name: content.hero_name,
        hero_intro_prefix: content.hero_intro_prefix,
        hero_intro_highlight: content.hero_intro_highlight,
        hero_intro_suffix: content.hero_intro_suffix,
        hero_intro_line2: content.hero_intro_line2,
        contact_title: content.contact_title,
        contact_description: content.contact_description,
        contact_button_text: content.contact_button_text,
        interests: (content.interests ?? []).slice(0, 5),
      });
      toast.success('保存成功');
    } catch (e: any) {
      toast.error(e?.message ?? '保存失败');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">主页管理</h1>
            <p className="text-sm text-muted-foreground">编辑联系方式、自我介绍与兴趣爱好。</p>
          </div>
          <Button variant="outline" className="rounded-full" onClick={handleSignOut}>
            退出登录
          </Button>
        </div>

        <div className="space-y-4 rounded-2xl border border-primary/20 bg-muted/10 p-6">
          <h2 className="text-xl font-semibold text-primary">联系方式</h2>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">标题</label>
            <Input value={content.contact_title} onChange={(e) => setContent((p) => ({ ...p, contact_title: e.target.value }))} />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">描述</label>
            <Textarea
              value={content.contact_description}
              onChange={(e) => setContent((p) => ({ ...p, contact_description: e.target.value }))}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">按钮文字</label>
            <Input
              value={content.contact_button_text}
              onChange={(e) => setContent((p) => ({ ...p, contact_button_text: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-primary/20 bg-muted/10 p-6">
          <h2 className="text-xl font-semibold text-primary">自我介绍</h2>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">姓名</label>
            <Input value={content.hero_name} onChange={(e) => setContent((p) => ({ ...p, hero_name: e.target.value }))} />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">第一行前缀（含“正在学习用”前后）</label>
            <Input
              value={content.hero_intro_prefix}
              onChange={(e) => setContent((p) => ({ ...p, hero_intro_prefix: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">高亮片段</label>
            <Input
              value={content.hero_intro_highlight}
              onChange={(e) => setContent((p) => ({ ...p, hero_intro_highlight: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">第一行后缀（结尾建议保留逗号）</label>
            <Input
              value={content.hero_intro_suffix}
              onChange={(e) => setContent((p) => ({ ...p, hero_intro_suffix: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">第二行</label>
            <Input value={content.hero_intro_line2} onChange={(e) => setContent((p) => ({ ...p, hero_intro_line2: e.target.value }))} />
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-primary/20 bg-muted/10 p-6">
          <h2 className="text-xl font-semibold text-primary">兴趣爱好</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interests.map((value, idx) => (
              <div key={idx} className="space-y-2">
                <label className="text-sm text-muted-foreground">
                  兴趣 {idx + 1}
                </label>
                <Input
                  value={value}
                  onChange={(e) => {
                    const next = [...content.interests];
                    next[idx] = e.target.value;
                    setContent((p) => ({ ...p, interests: next }));
                  }}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">图标会按固定顺序匹配（你只需要改文字即可）。</p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button
            className="rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? '保存中...' : '保存'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminManage;

