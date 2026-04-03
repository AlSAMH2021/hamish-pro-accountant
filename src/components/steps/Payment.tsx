import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DashboardLayout from '@/components/DashboardLayout';
import { CreditCard, Shield, Building2, Copy, CheckCircle, ArrowLeft } from 'lucide-react';

type PaymentMethod = 'transfer' | 'card' | null;

const Payment = () => {
  const { setPaymentStatus, setCurrentStep } = useApp();
  const [method, setMethod] = useState<PaymentMethod>(null);
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [copied, setCopied] = useState(false);
  const [transferConfirmed, setTransferConfirmed] = useState(false);

  const handleCardPayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setPaymentStatus(true);
      setProcessing(false);
      setCurrentStep(5);
    }, 2000);
  };

  const handleTransferConfirm = () => {
    setTransferConfirmed(true);
    setTimeout(() => {
      setPaymentStatus(true);
      setCurrentStep(5);
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const bankDetails = {
    bank: 'بنك الراجحي',
    name: 'مؤسسة هامش للتدريب',
    iban: 'SA0380000000608010167519',
    amount: '299 ر.س',
  };

  return (
    <DashboardLayout activePage="payment">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Price summary */}
        <div className="bg-card rounded-2xl shadow-card p-6 text-center">
          <p className="text-muted-foreground text-sm mb-2">رسوم الاختبار</p>
          <p className="text-5xl font-bold text-foreground">299 <span className="text-lg text-muted-foreground">ر.س</span></p>
          <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
            <span className="bg-muted/50 px-3 py-1.5 rounded-lg">✓ 45 سؤال متخصص</span>
            <span className="bg-muted/50 px-3 py-1.5 rounded-lg">✓ تقرير تفصيلي</span>
            <span className="bg-muted/50 px-3 py-1.5 rounded-lg">✓ جلسة استشارية</span>
          </div>
        </div>

        {/* Method selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setMethod('transfer')}
            className={`p-6 rounded-2xl border-2 transition-all text-center ${
              method === 'transfer'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/30 bg-card'
            }`}
          >
            <Building2 className={`w-10 h-10 mx-auto mb-3 ${method === 'transfer' ? 'text-primary' : 'text-muted-foreground'}`} />
            <p className="font-bold text-foreground">تحويل بنكي</p>
            <p className="text-sm text-muted-foreground mt-1">حوّل المبلغ وأكّد</p>
          </button>

          <button
            onClick={() => setMethod('card')}
            className={`p-6 rounded-2xl border-2 transition-all text-center ${
              method === 'card'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/30 bg-card'
            }`}
          >
            <CreditCard className={`w-10 h-10 mx-auto mb-3 ${method === 'card' ? 'text-primary' : 'text-muted-foreground'}`} />
            <p className="font-bold text-foreground">بطاقة بنكية</p>
            <p className="text-sm text-muted-foreground mt-1">مدى / فيزا / ماستركارد</p>
          </button>
        </div>

        {/* Transfer details */}
        {method === 'transfer' && (
          <div className="bg-card rounded-2xl shadow-card p-6 animate-fade-in-up">
            <h3 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              بيانات الحوالة البنكية
            </h3>
            <div className="space-y-4">
              {[
                { label: 'البنك', value: bankDetails.bank },
                { label: 'اسم الحساب', value: bankDetails.name },
                { label: 'IBAN', value: bankDetails.iban, copyable: true },
                { label: 'المبلغ', value: bankDetails.amount },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-foreground font-medium text-sm" dir="ltr">{item.value}</p>
                  </div>
                  {item.copyable && (
                    <button
                      onClick={() => copyToClipboard(item.value)}
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-warning/10 border border-warning/20">
              <p className="text-sm text-warning font-medium">⚠️ يرجى كتابة اسمك في ملاحظات التحويل ليتم التحقق</p>
            </div>

            <Button
              onClick={handleTransferConfirm}
              disabled={transferConfirmed}
              className="w-full h-14 text-lg font-bold bg-gradient-primary text-primary-foreground rounded-xl mt-6"
            >
              {transferConfirmed ? (
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  تم التأكيد — جاري التحقق...
                </span>
              ) : (
                'تأكيد التحويل'
              )}
            </Button>
          </div>
        )}

        {/* Card form */}
        {method === 'card' && (
          <div className="bg-card rounded-2xl shadow-card p-6 animate-fade-in-up">
            <h3 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              بيانات البطاقة
            </h3>
            <div className="space-y-4">
              <div>
                <Label className="text-foreground font-medium mb-1.5 block text-sm">رقم البطاقة</Label>
                <Input
                  placeholder="XXXX XXXX XXXX XXXX"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim())}
                  className="h-12 text-left"
                  dir="ltr"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-foreground font-medium mb-1.5 block text-sm">تاريخ الانتهاء</Label>
                  <Input placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(e.target.value)} className="h-12 text-left" dir="ltr" />
                </div>
                <div>
                  <Label className="text-foreground font-medium mb-1.5 block text-sm">CVV</Label>
                  <Input placeholder="XXX" value={cvv} onChange={(e) => setCvv(e.target.value)} className="h-12 text-left" dir="ltr" type="password" />
                </div>
              </div>
            </div>

            <Button
              onClick={handleCardPayment}
              disabled={processing}
              className="w-full h-14 text-lg font-bold bg-gradient-primary text-primary-foreground rounded-xl mt-6"
            >
              {processing ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  جاري المعالجة...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  ادفع 299 ر.س
                </span>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>دفع آمن ومشفر</span>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Payment;
