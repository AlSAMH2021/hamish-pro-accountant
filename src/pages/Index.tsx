import { AppProvider, useApp } from '@/context/AppContext';
import Landing from '@/components/steps/Landing';
import Login from '@/components/steps/Login';
import Registration from '@/components/steps/Registration';
import ForgotPassword from '@/components/steps/ForgotPassword';
import Briefing from '@/components/steps/Briefing';
import Payment from '@/components/steps/Payment';
import NdaAgreement from '@/components/steps/NdaAgreement';
import ExamEngine from '@/components/steps/ExamEngine';
import Results from '@/components/steps/Results';
import Booking from '@/components/steps/Booking';
import Report from '@/components/steps/Report';
import Profile from '@/components/steps/Profile';
import { Loader2 } from 'lucide-react';

const StepRenderer = () => {
  const { currentStep, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  switch (currentStep) {
    case 1: return <Landing />;
    case 2: return <Registration />;
    case 9: return <Login />;
    case 11: return <ForgotPassword />;
    case 3: return <Briefing />;
    case 4: return <Payment />;
    case 12: return <NdaAgreement />;
    case 5: return <ExamEngine />;
    case 6: return <Results />;
    case 7: return <Booking />;
    case 8: return <Report />;
    case 10: return <Profile />;
    default: return <Landing />;
  }
};

const Index = () => (
  <AppProvider>
    <StepRenderer />
  </AppProvider>
);

export default Index;
