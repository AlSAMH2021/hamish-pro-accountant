import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/DashboardLayout';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

const NdaAgreement = () => {
  const { setCurrentStep, session } = useApp();
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleAccept = async () => {
    if (!agreed || !session?.user) return;
    setSubmitting(true);
    await supabase.from('profiles').update({ nda_accepted: true }).eq('user_id', session.user.id);
    setCurrentStep(5); // Go to ExamEngine (step index for exam)
    setSubmitting(false);
  };

  return (
    <DashboardLayout activePage="nda">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-card rounded-2xl shadow-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">اتفاقية عدم إفشاء السرية</h2>
              <p className="text-sm text-muted-foreground">يرجى قراءة الاتفاقية والموافقة عليها قبل البدء بالتقييم</p>
            </div>
          </div>

          <div className="bg-muted/30 rounded-xl p-5 space-y-4 text-sm text-foreground leading-relaxed max-h-[400px] overflow-y-auto">
            <p className="font-bold">اتفاقية عدم إفشاء وسرية المعلومات</p>
            
            <p>بموجب هذه الاتفاقية، أتعهد أنا المتقدم/ة للتقييم بالآتي:</p>

            <ol className="list-decimal space-y-3 pr-5">
              <li>
                <strong>السرية التامة:</strong> أتعهد بالحفاظ على سرية جميع أسئلة التقييم ومحتوياته وعدم مشاركتها مع أي طرف آخر بأي شكل من الأشكال (شفهياً، كتابياً، إلكترونياً، أو بأي وسيلة أخرى).
              </li>
              <li>
                <strong>عدم التصوير أو النسخ:</strong> أتعهد بعدم تصوير أو نسخ أو تسجيل أي جزء من التقييم أو نتائجه التفصيلية.
              </li>
              <li>
                <strong>الاستخدام الشخصي:</strong> أقر بأن هذا التقييم مخصص لاستخدامي الشخصي فقط ولا يجوز لي السماح لأي شخص آخر بالوصول إليه.
              </li>
              <li>
                <strong>حماية الملكية الفكرية:</strong> أقر بأن جميع محتويات التقييم هي ملكية فكرية خاصة بمؤسسة هامش للتدريب ومحمية بموجب قوانين حقوق الملكية الفكرية.
              </li>
              <li>
                <strong>المسؤولية القانونية:</strong> أدرك أن مخالفة هذه الاتفاقية قد تعرضني للمساءلة القانونية والتبعات النظامية.
              </li>
            </ol>

            <p className="text-muted-foreground text-xs mt-4">
              بالموافقة على هذه الاتفاقية، أقر بأنني قرأت وفهمت جميع البنود المذكورة أعلاه وأوافق على الالتزام بها.
            </p>
          </div>

          <div className="mt-6">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-foreground font-medium">
                أقر بأنني قرأت اتفاقية عدم إفشاء السرية وأوافق على جميع بنودها
              </span>
            </label>
          </div>

          <Button
            onClick={handleAccept}
            disabled={!agreed || submitting}
            className="w-full h-14 text-lg font-bold bg-gradient-primary text-primary-foreground rounded-xl mt-6 gap-2"
          >
            الموافقة والبدء بالتقييم
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NdaAgreement;
