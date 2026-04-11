import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DashboardLayout from '@/components/DashboardLayout';
import { CreditCard, Shield, Building2, Copy, CheckCircle, Clock, Upload, Tag, Loader2 } from 'lucide-react';

type PaymentMethod = 'transfer' | 'card' | null;

const Payment = () => {
  const { setPaymentStatus, setCurrentStep, user } = useApp();
  const [method, setMethod] = useState<PaymentMethod>(null);
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [copied, setCopied] = useState(false);
  const [transferConfirmed, setTransferConfirmed] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState<{ percent: number; codeId: string } | null>(null);
  const [discountError, setDiscountError] = useState('');
  const [checkingCode, setCheckingCode] = useState(false);

  const basePrice = 299;
  const finalPrice = discountApplied ? Math.round(basePrice * (1 - discountApplied.percent / 100)) : basePrice;

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    setCheckingCode(true);
    setDiscountError('');
    try {
      const { data, error } = await supabase
        .from('discount_codes')
        .select('id, discount_percent, max_uses')
        .eq('code', discountCode.trim().toUpperCase())
        .eq('is_active', true)
        .maybeSingle();

      if (error || !data) {
        setDiscountError('كود الخصم غير صالح');
        setCheckingCode(false);
        return;
      }

      // Check usage count
      if (data.max_uses) {
        const { count } = await supabase
          .from('discount_code_usages')
          .select('id', { count: 'exact', head: true })
          .eq('code_id', data.id);
        if ((count || 0) >= data.max_uses) {
          setDiscountError('تم استنفاد هذا الكود');
          setCheckingCode(false);
          return;
        }
      }

      setDiscountApplied({ percent: data.discount_percent, codeId: data.id });
    } catch {
      setDiscountError('حدث خطأ');
    }
    setCheckingCode(false);
  };

  const recordDiscountUsage = async () => {
    if (!discountApplied) return;
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return;
    await supabase.from('discount_code_usages').insert({
      code_id: discountApplied.codeId,
      user_id: authUser.id,
    });
  };

  const handleCardPayment = async () => {
    setProcessing(true);
    await recordDiscountUsage();
    setTimeout(() => {
      setPaymentStatus(true);
      setProcessing(false);
      setCurrentStep(12);
    }, 2000);
  };

  const uploadReceipt = async (): Promise<string | null> => {
    if (!receiptFile) return null;
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return null;

    const ext = receiptFile.name.split('.').pop();
    const path = `${authUser.id}/receipt-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from('receipts')
      .upload(path, receiptFile);

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    // Save receipt path to profile
    await supabase.from('profiles').update({ receipt_url: path }).eq('user_id', authUser.id);
    return path;
  };

  const handleTransferConfirm = async () => {
    if (!receiptFile) return;
    setProcessing(true);
    setUploadingReceipt(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      await uploadReceipt();
      await recordDiscountUsage();

      await supabase
        .from('profiles')
        .update({ status: 'pending_payment' })
        .eq('user_id', authUser.id);

      await supabase.rpc('notify_admins', {
        p_title: 'طلب تأكيد تحويل بنكي',
        p_message: `${user?.name || 'مستخدم'} قام بتأكيد تحويل بنكي بمبلغ ${finalPrice} ر.س — يرجى التحقق وتحديث حالة الدفع.`,
      });

      setTransferConfirmed(true);
    } catch (err) {
      console.error('Error confirming transfer:', err);
    } finally {
      setProcessing(false);
      setUploadingReceipt(false);
    }
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
    amount: `${finalPrice} ر.س`,
  };

  return (
    <DashboardLayout activePage="payment">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Price summary */}
        <div className="bg-card rounded-2xl shadow-card p-6 text-center">
          <p className="text-muted-foreground text-sm mb-2">رسوم الاختبار</p>
          {discountApplied ? (
            <div>
              <p className="text-2xl text-muted-foreground line-through">{basePrice} ر.س</p>
              <p className="text-5xl font-bold text-foreground">{finalPrice} <span className="text-lg text-muted-foreground">ر.س</span></p>
              <span className="inline-block mt-2 bg-success/10 text-success text-sm font-bold px-3 py-1 rounded-full">خصم {discountApplied.percent}%</span>
            </div>
          ) : (
            <p className="text-5xl font-bold text-foreground">{basePrice} <span className="text-lg text-muted-foreground">ر.س</span></p>
          )}
          <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
            <span className="bg-muted/50 px-3 py-1.5 rounded-lg">✓ 45 سؤال متخصص</span>
            <span className="bg-muted/50 px-3 py-1.5 rounded-lg">✓ تقرير تفصيلي</span>
            <span className="bg-muted/50 px-3 py-1.5 rounded-lg">✓ جلسة استشارية</span>
          </div>
        </div>

        {/* Discount Code */}
        <div className="bg-card rounded-2xl shadow-card p-5">
          <Label className="text-foreground font-medium mb-2 block text-sm flex items-center gap-2">
            <Tag className="w-4 h-4 text-primary" />
            كود الخصم
          </Label>
          <div className="flex gap-2">
            <Input
              placeholder="أدخل كود الخصم"
              value={discountCode}
              onChange={e => { setDiscountCode(e.target.value.toUpperCase()); setDiscountError(''); }}
              disabled={!!discountApplied}
              className="h-11 flex-1"
            />
            <Button
              onClick={handleApplyDiscount}
              disabled={!!discountApplied || checkingCode || !discountCode.trim()}
              variant="outline"
              className="h-11 px-5"
            >
              {checkingCode ? <Loader2 className="w-4 h-4 animate-spin" /> : discountApplied ? <CheckCircle className="w-4 h-4 text-success" /> : 'تطبيق'}
            </Button>
          </div>
          {discountError && <p className="text-destructive text-xs mt-2">{discountError}</p>}
          {discountApplied && <p className="text-success text-xs mt-2">تم تطبيق خصم {discountApplied.percent}% بنجاح!</p>}
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
            <p className="text-sm text-muted-foreground mt-1">حوّل المبلغ وأرفق الإيصال</p>
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

            {/* Receipt Upload */}
            <div className="mt-6">
              <Label className="text-foreground font-medium mb-2 block text-sm flex items-center gap-2">
                <Upload className="w-4 h-4 text-primary" />
                إرفاق إيصال التحويل <span className="text-destructive">*</span>
              </Label>
              <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-primary/30 transition-colors">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={e => setReceiptFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="receipt-upload"
                />
                <label htmlFor="receipt-upload" className="cursor-pointer">
                  {receiptFile ? (
                    <div className="flex items-center justify-center gap-2 text-success">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">{receiptFile.name}</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">اضغط لرفع صورة الإيصال أو ملف PDF</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-warning/10 border border-warning/20">
              <p className="text-sm text-warning font-medium">⚠️ يرجى كتابة اسمك في ملاحظات التحويل ليتم التحقق</p>
            </div>

            <Button
              onClick={handleTransferConfirm}
              disabled={transferConfirmed || !receiptFile || processing}
              className="w-full h-14 text-lg font-bold bg-gradient-primary text-primary-foreground rounded-xl mt-6"
            >
              {uploadingReceipt ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري رفع الإيصال...
                </span>
              ) : transferConfirmed ? (
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  تم الإرسال
                </span>
              ) : (
                'تأكيد التحويل وإرفاق الإيصال'
              )}
            </Button>

            {transferConfirmed && (
              <div className="mt-4 p-5 rounded-xl bg-primary/5 border border-primary/20 text-center space-y-2">
                <Clock className="w-8 h-8 text-primary mx-auto" />
                <p className="font-bold text-foreground">طلبك قيد المراجعة</p>
                <p className="text-sm text-muted-foreground">
                  سيتم التحقق من عملية التحويل وتفعيل حسابك خلال وقت قصير. ستصلك إشعار عند التأكيد.
                </p>
              </div>
            )}
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
                  ادفع {finalPrice} ر.س
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
