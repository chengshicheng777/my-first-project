import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/db/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/admin', { replace: true });
    });
  }, [navigate]);

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      toast.error('请输入邮箱和密码');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('登录成功');
      navigate('/admin', { replace: true });
    } catch (e: any) {
      toast.error(e?.message ?? '登录失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignUp = async () => {
    if (!email.trim() || !password) {
      toast.error('请输入邮箱和密码');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      toast.success('注册成功，请在 Supabase 控制台完成确认（如有）');
    } catch (e: any) {
      toast.error(e?.message ?? '注册失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-primary/20 bg-muted/20 p-6">
        <h1 className="text-2xl font-bold text-primary mb-2">管理员登录</h1>
        <p className="text-sm text-muted-foreground mb-6">登录后可管理主页内容与最近分享上传/删除。</p>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">邮箱</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">密码</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入密码"
            />
          </div>

          <Button
            className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleSignIn}
            disabled={submitting}
          >
            {submitting ? '登录中...' : '登录'}
          </Button>

          <Button
            variant="outline"
            className="w-full rounded-full"
            onClick={handleSignUp}
            disabled={submitting}
          >
            {submitting ? '处理中...' : '注册'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

