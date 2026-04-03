import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Loader2, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logoColor from '@/assets/logo-color.png';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [isRecovery, setIsRecovery] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Listen for PASSWORD_RECOVERY event from Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true);
        setChecking(false);
      }
    });

    // Also check hash for recovery token (fallback)
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      setIsRecovery(true);
      setChecking(false);
    }

    // Give it a moment then stop checking
    const timeout = setTimeout(() => {
      setChecking(false);
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (!checking && !isRecovery) {
      navigate('/');
    }
  }, [checking, isRecovery, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }
    setSubmitting(true);
    setError('');
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (updateError) {
      setError(updateError.message);
    } else {
      setDone(true);
      setTimeout(() => navigate('/'), 3000);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="bg-card border-b border-border">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-center">
          <img src={logoColor} alt="هامش" className="h-10" />
        </div>
      </div>

      <div className="flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-1">تعيين كلمة مرور جديدة</h1>
            <p className="text-muted-foreground text-sm">أدخل كلمة المرور الجديدة</p>
          </div>

          {done ? (
            <div className="bg-card rounded-2xl shadow-card p-6 text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-success mx-auto" />
              <h2 className="text-lg font-bold text-foreground">تم تغيير كلمة المرور بنجاح</h2>
              <p className="text-muted-foreground text-sm">جاري تحويلك للصفحة الرئيسية...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-card p-6 md:p-8 space-y-4">
              <div>
                <Label className="text-foreground font-medium mb-1.5 block text-sm">كلمة المرور الجديدة</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11" />
              </div>
              <div>
                <Label className="text-foreground font-medium mb-1.5 block text-sm">تأكيد كلمة المرور</Label>
                <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="h-11" />
              </div>
              {error && <p className="text-destructive text-sm text-center bg-destructive/10 p-3 rounded-xl">{error}</p>}
              <Button type="submit" disabled={submitting} className="w-full h-13 text-base font-bold bg-gradient-primary text-primary-foreground rounded-xl">
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'تعيين كلمة المرور'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
