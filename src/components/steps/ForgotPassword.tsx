import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import logoColor from '@/assets/logo-color.png';

const ForgotPassword = () => {
  const { setCurrentStep, resetPassword } = useApp();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('يرجى إدخال البريد الإلكتروني');
      return;
    }
    setSubmitting(true);
    setError('');
    const { error: resetError } = await resetPassword(email);
    setSubmitting(false);
    if (resetError) {
      setError(resetError);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="bg-card border-b border-border">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => setCurrentStep(9)} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowRight className="w-5 h-5" />
          </button>
          <img src={logoColor} alt="هامش" className="h-10" />
          <div className="w-5" />
        </div>
      </div>

      <div className="flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-1">استعادة كلمة المرور</h1>
            <p className="text-muted-foreground text-sm">أدخل بريدك الإلكتروني لإرسال رابط إعادة التعيين</p>
          </div>

          {sent ? (
            <div className="bg-card rounded-2xl shadow-card p-6 md:p-8 text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-success mx-auto" />
              <h2 className="text-lg font-bold text-foreground">تم الإرسال بنجاح</h2>
              <p className="text-muted-foreground text-sm">
                تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى مراجعة صندوق الوارد.
              </p>
              <Button onClick={() => setCurrentStep(9)} variant="outline" className="rounded-xl">
                العودة لتسجيل الدخول
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-card p-6 md:p-8 space-y-4">
              <div>
                <Label className="text-foreground font-medium mb-1.5 block text-sm">البريد الإلكتروني</Label>
                <Input
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                  dir="auto"
                />
              </div>

              {error && (
                <p className="text-destructive text-sm text-center bg-destructive/10 p-3 rounded-xl">{error}</p>
              )}

              <Button type="submit" disabled={submitting} className="w-full h-12 text-base font-semibold bg-foreground text-background hover:bg-foreground/90 rounded-lg">
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'إرسال رابط الاستعادة'}
              </Button>

              <div className="text-center pt-1">
                <button type="button" onClick={() => setCurrentStep(9)} className="text-primary text-sm font-medium hover:underline">
                  العودة لتسجيل الدخول
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
