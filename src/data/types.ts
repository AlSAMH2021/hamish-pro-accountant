export type Sector = 'tourism' | 'restaurants' | 'healthcare';
export type Axis = 'financial' | 'cost' | 'tax' | 'regulations' | 'ifrs';
export type UserStatus = 'registered' | 'paid' | 'exam_completed' | 'booked';
export type PerformanceLevel = 'ممتاز' | 'جيد جداً' | 'جيد' | 'مقبول' | 'ضعيف';

export interface Question {
  id: number;
  text: string;
  options: string[];
  axis: Axis;
  sector: string;
  explanation: string;
}

export interface UserData {
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  company: string;
  sector: Sector;
  password: string;
  status: UserStatus;
  paymentStatus: boolean;
}

export interface ExamResult {
  answers: Record<number, number>;
  axisScores: Record<Axis, number>;
  totalScore: number;
  performanceLevel: PerformanceLevel;
  passed: boolean;
  axisPassed: Record<Axis, boolean>;
  completedAt: string;
}

export interface BookingData {
  date: string;
  time: string;
  bookedAt: string;
  sessionLink?: string;
}

export const AXES: { key: Axis; label: string; icon: string }[] = [
  { key: 'financial', label: 'المحاسبة المالية', icon: '📊' },
  { key: 'cost', label: 'محاسبة التكاليف', icon: '💰' },
  { key: 'tax', label: 'الضرائب والزكاة', icon: '🧾' },
  { key: 'regulations', label: 'التشريعات والأنظمة', icon: '⚖️' },
  { key: 'ifrs', label: 'المعايير الدولية IFRS', icon: '🌐' },
];

export const SECTOR_LABELS: Record<Sector, string> = {
  tourism: 'السياحة والفنادق',
  restaurants: 'المطاعم والمقاهي',
  healthcare: 'الصحة والمنشآت الطبية',
};

export const AXIS_RECOMMENDATIONS: Record<Axis, { course: string; hours: number }> = {
  financial: { course: 'دورة: المحاسبة المالية والتقارير', hours: 16 },
  cost: { course: 'دورة: محاسبة التكاليف وتحليل الربحية', hours: 12 },
  tax: { course: 'دورة: الضريبة والزكاة وفق الأنظمة السعودية', hours: 16 },
  regulations: { course: 'دورة: الأنظمة والتشريعات السعودية', hours: 8 },
  ifrs: { course: 'دورة: IFRS التطبيقي', hours: 20 },
};

export const getPerformanceLevel = (total: number): PerformanceLevel => {
  if (total >= 41) return 'ممتاز';
  if (total >= 36) return 'جيد جداً';
  if (total >= 30) return 'جيد';
  if (total >= 25) return 'مقبول';
  return 'ضعيف';
};

export const getPerformanceColor = (level: PerformanceLevel): string => {
  switch (level) {
    case 'ممتاز': return 'text-success';
    case 'جيد جداً': return 'text-success';
    case 'جيد': return 'text-warning';
    case 'مقبول': return 'text-warning';
    case 'ضعيف': return 'text-destructive';
  }
};
