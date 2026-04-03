import { AppProvider, useApp } from '@/context/AppContext';
import Landing from '@/components/steps/Landing';
import Registration from '@/components/steps/Registration';
import Briefing from '@/components/steps/Briefing';
import Payment from '@/components/steps/Payment';
import ExamEngine from '@/components/steps/ExamEngine';
import Results from '@/components/steps/Results';
import Booking from '@/components/steps/Booking';
import Report from '@/components/steps/Report';

const StepRenderer = () => {
  const { currentStep } = useApp();
  switch (currentStep) {
    case 1: return <Landing />;
    case 2: return <Registration />;
    case 3: return <Briefing />;
    case 4: return <Payment />;
    case 5: return <ExamEngine />;
    case 6: return <Results />;
    case 7: return <Booking />;
    case 8: return <Report />;
    default: return <Landing />;
  }
};

const Index = () => (
  <AppProvider>
    <StepRenderer />
  </AppProvider>
);

export default Index;
