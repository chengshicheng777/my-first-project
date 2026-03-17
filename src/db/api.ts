import { supabase } from './supabase';

export interface PortfolioWork {
  id: string;
  type: 'video' | 'image';
  title: string;
  description: string;
  thumbnail_url: string;
  media_url: string;
  platform: '小红书' | 'B站';
  views?: string;
  likes: string;
  comments: string;
  tags: string[];
  created_at: string;
}

// 获取所有作品
export async function getPortfolioWorks(): Promise<PortfolioWork[]> {
  const { data, error } = await supabase
    .from('portfolio_works')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('获取作品失败:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

// 添加新作品
export async function addPortfolioWork(work: Omit<PortfolioWork, 'id' | 'created_at'>): Promise<PortfolioWork | null> {
  const { data, error } = await supabase
    .from('portfolio_works')
    .insert([work])
    .select()
    .maybeSingle();

  if (error) {
    console.error('添加作品失败:', error);
    throw error;
  }

  return data;
}

// 删除作品
export async function deletePortfolioWork(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('portfolio_works')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('删除作品失败:', error);
    return false;
  }

  return true;
}

// 上传文件到Supabase Storage
export async function uploadPortfolioFile(file: File, type: 'video' | 'image'): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${type}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('portfolio-media')
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error('上传文件失败:', error);
    throw error;
  }

  const { data: urlData } = supabase.storage
    .from('portfolio-media')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

// 删除存储文件
export async function deletePortfolioFile(url: string): Promise<boolean> {
  try {
    const fileName = url.split('/portfolio-media/').pop();
    if (!fileName) return false;

    const { error } = await supabase.storage
      .from('portfolio-media')
      .remove([fileName]);

    if (error) {
      console.error('删除文件失败:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('删除文件失败:', error);
    return false;
  }
}
