-- 收紧：仅允许认证用户管理作品（上传/删除）

-- 作品表策略
DROP POLICY IF EXISTS "允许插入作品" ON portfolio_works;
DROP POLICY IF EXISTS "允许删除作品" ON portfolio_works;

-- 允许认证用户插入
CREATE POLICY "auth_insert_portfolio_works" ON portfolio_works
  FOR INSERT TO authenticated
  WITH CHECK (auth.role() = 'authenticated');

-- 允许认证用户删除
CREATE POLICY "auth_delete_portfolio_works" ON portfolio_works
  FOR DELETE TO authenticated
  USING (auth.role() = 'authenticated');

-- Storage 策略：收紧只允许认证用户上传/删除 portfolio-media

DROP POLICY IF EXISTS "允许上传作品文件" ON storage.objects;
DROP POLICY IF EXISTS "允许删除作品文件" ON storage.objects;

CREATE POLICY "auth_upload_portfolio_media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'portfolio-media' AND auth.role() = 'authenticated');

CREATE POLICY "auth_delete_portfolio_media" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'portfolio-media' AND auth.role() = 'authenticated');

