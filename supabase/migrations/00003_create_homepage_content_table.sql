-- 创建主页可编辑内容表（单例数据：id = 1）
CREATE TABLE IF NOT EXISTS homepage_content (
  id INTEGER PRIMARY KEY DEFAULT 1,

  hero_name TEXT NOT NULL DEFAULT '成橙妈妈',
  hero_intro_prefix TEXT NOT NULL DEFAULT '嗨，我是成橙妈妈。一个正在学习用 ',
  hero_intro_highlight TEXT NOT NULL DEFAULT 'AI 做自媒体',
  hero_intro_suffix TEXT NOT NULL DEFAULT ' 的妈妈，',
  hero_intro_line2 TEXT NOT NULL DEFAULT '记录日常，也分享成长。',

  contact_title TEXT NOT NULL DEFAULT '联系方式',
  contact_description TEXT NOT NULL DEFAULT '想快速练习我？点击按钮立即开始聊天（也可直接点右下角「聊聊育儿和 AI」）。',
  contact_button_text TEXT NOT NULL DEFAULT '立即开始联系',

  interests TEXT[] NOT NULL DEFAULT ARRAY['AI', '旅行', '读书', '插花', '喝茶'],

  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;

-- 访客可读
CREATE POLICY "public_read_homepage_content" ON homepage_content
  FOR SELECT USING (true);

-- 仅认证用户可写（上传/删除/编辑）
CREATE POLICY "auth_write_homepage_content_insert" ON homepage_content
  FOR INSERT TO authenticated
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "auth_write_homepage_content_update" ON homepage_content
  FOR UPDATE TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "auth_write_homepage_content_delete" ON homepage_content
  FOR DELETE TO authenticated
  USING (auth.role() = 'authenticated');

-- 插入默认单例数据
INSERT INTO homepage_content (
  id,
  hero_name,
  hero_intro_prefix,
  hero_intro_highlight,
  hero_intro_suffix,
  hero_intro_line2,
  contact_title,
  contact_description,
  contact_button_text,
  interests
) VALUES (
  1,
  '成橙妈妈',
  '嗨，我是成橙妈妈。一个正在学习用 ',
  'AI 做自媒体',
  ' 的妈妈，',
  '记录日常，也分享成长。',
  '联系方式',
  '想快速练习我？点击按钮立即开始聊天（也可直接点右下角「聊聊育儿和 AI」）。',
  '立即开始联系',
  ARRAY['AI', '旅行', '读书', '插花', '喝茶']
)
ON CONFLICT (id) DO UPDATE SET
  hero_name = EXCLUDED.hero_name,
  hero_intro_prefix = EXCLUDED.hero_intro_prefix,
  hero_intro_highlight = EXCLUDED.hero_intro_highlight,
  hero_intro_suffix = EXCLUDED.hero_intro_suffix,
  hero_intro_line2 = EXCLUDED.hero_intro_line2,
  contact_title = EXCLUDED.contact_title,
  contact_description = EXCLUDED.contact_description,
  contact_button_text = EXCLUDED.contact_button_text,
  interests = EXCLUDED.interests,
  updated_at = NOW();

