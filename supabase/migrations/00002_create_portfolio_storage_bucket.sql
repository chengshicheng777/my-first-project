-- 创建存储桶用于作品文件
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-media',
  'portfolio-media',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO NOTHING;

-- 设置存储桶策略
CREATE POLICY "允许所有人查看作品文件" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio-media');

CREATE POLICY "允许上传作品文件" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'portfolio-media');

CREATE POLICY "允许删除作品文件" ON storage.objects
  FOR DELETE USING (bucket_id = 'portfolio-media');