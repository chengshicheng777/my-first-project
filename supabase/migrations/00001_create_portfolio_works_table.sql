-- 创建作品集表
CREATE TABLE IF NOT EXISTS portfolio_works (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('video', 'image')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  media_url TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('小红书', 'B站')),
  views TEXT,
  likes TEXT NOT NULL DEFAULT '0',
  comments TEXT NOT NULL DEFAULT '0',
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_portfolio_works_type ON portfolio_works(type);
CREATE INDEX IF NOT EXISTS idx_portfolio_works_created_at ON portfolio_works(created_at DESC);

-- 设置RLS策略
ALTER TABLE portfolio_works ENABLE ROW LEVEL SECURITY;

-- 允许所有人查看作品
CREATE POLICY "允许所有人查看作品" ON portfolio_works
  FOR SELECT USING (true);

-- 允许匿名用户插入作品（用于演示，实际应该限制为管理员）
CREATE POLICY "允许插入作品" ON portfolio_works
  FOR INSERT WITH CHECK (true);

-- 允许删除作品
CREATE POLICY "允许删除作品" ON portfolio_works
  FOR DELETE USING (true);

-- 插入初始示例数据
INSERT INTO portfolio_works (type, title, description, thumbnail_url, media_url, platform, views, likes, comments, tags) VALUES
('video', '3-6岁孩子如何培养表达力？', '通过AI工具辅助，让孩子在游戏中学会清晰表达自己的想法。这期视频分享了我和孩子一起实践的3个小技巧。', 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_23f20b37-a7b2-4cb5-a860-ede1ac8d919f.jpg', 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_23f20b37-a7b2-4cb5-a860-ede1ac8d919f.jpg', 'B站', '2.3万', '1.2k', '156', ARRAY['AI教育', '表达力', '亲子互动']),
('video', 'AI时代，孩子需要什么能力？', '深度探讨AI对未来教育的影响，以及我们如何在日常生活中培养孩子的核心竞争力。', 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_ea7a3615-a9f4-4fb5-beb4-fa68f74a5b87.jpg', 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_ea7a3615-a9f4-4fb5-beb4-fa68f74a5b87.jpg', 'B站', '5.6万', '3.8k', '428', ARRAY['AI教育', '未来能力', '深度思考']),
('image', '每日亲子阅读打卡', '坚持和孩子每天睡前阅读30分钟，记录我们一起读过的绘本和成长瞬间。', 'https://miaoda-image.cdn.bcebos.com/img/corpus/5df4dfb5a54644acad73c8fb5fac3f1a.jpg', 'https://miaoda-image.cdn.bcebos.com/img/corpus/5df4dfb5a54644acad73c8fb5fac3f1a.jpg', '小红书', NULL, '8.9k', '267', ARRAY['亲子阅读', '绘本推荐', '成长记录']),
('image', '孩子的创意手工作品集', '整理了孩子这半年的手工作品，每一件都充满了想象力和创造力。', 'https://miaoda-image.cdn.bcebos.com/img/corpus/2d2be12dba6a495ab0f660e895fb6c6d.jpg', 'https://miaoda-image.cdn.bcebos.com/img/corpus/2d2be12dba6a495ab0f660e895fb6c6d.jpg', '小红书', NULL, '6.2k', '189', ARRAY['创意手工', '艺术启蒙', '作品展示']),
('image', '周末户外探索日记', '带孩子走进大自然，在户外活动中培养观察力和探索精神。', 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_39de34aa-bfc2-4c40-b24d-7470d61bcd39.jpg', 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_39de34aa-bfc2-4c40-b24d-7470d61bcd39.jpg', '小红书', NULL, '12.5k', '342', ARRAY['户外教育', '自然探索', '亲子时光']),
('image', '如何用AI辅助孩子学习？', '分享我使用AI工具帮助孩子学习的实用方法和心得体会。', 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_72154655-3fa2-4c9c-a3e6-51fd3ce8cebe.jpg', 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_72154655-3fa2-4c9c-a3e6-51fd3ce8cebe.jpg', '小红书', NULL, '15.3k', '521', ARRAY['AI工具', '学习方法', '效率提升']);