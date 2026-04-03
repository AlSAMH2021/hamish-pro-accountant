import { useApp } from '@/context/AppContext';
import {
  FileText,
  ClipboardList,
  CalendarDays,
  User,
  LogOut,
  BarChart3,
  Menu,
  X,
  ChevronLeft,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

type DashboardPage = 'briefing' | 'payment' | 'exam' | 'results' | 'booking' | 'report' | 'profile';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activePage: DashboardPage;
}

const DashboardLayout = ({ children, activePage }: DashboardLayoutProps) => {
  const { user, setCurrentStep, examResult, booking, sessionCompleted, signOut } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
  };

  const navItems: { id: DashboardPage; label: string; icon: React.ReactNode; step: number; disabled?: boolean }[] = [
    { id: 'briefing', label: 'ملخص الاختبار', icon: <ClipboardList className="w-5 h-5" />, step: 3 },
    { id: 'payment', label: 'الدفع', icon: <FileText className="w-5 h-5" />, step: 4, disabled: user?.paymentStatus },
    { id: 'exam', label: 'الاختبار', icon: <BarChart3 className="w-5 h-5" />, step: 5, disabled: !user?.paymentStatus || !!examResult },
    { id: 'results', label: 'النتائج', icon: <BarChart3 className="w-5 h-5" />, step: 6, disabled: !examResult },
    { id: 'booking', label: 'حجز الجلسة', icon: <CalendarDays className="w-5 h-5" />, step: 7, disabled: !examResult },
    { id: 'report', label: 'التقرير', icon: <FileText className="w-5 h-5" />, step: 8, disabled: !examResult },
    { id: 'profile', label: 'الملف الشخصي', icon: <User className="w-5 h-5" />, step: 10 },
  ];

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 right-0 z-50 h-screen w-72 bg-card border-l border-border flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                {user?.name?.charAt(0)}
              </div>
              <div>
                <h2 className="font-bold text-foreground text-sm">{user?.name}</h2>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            const isDisabled = item.disabled;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (!isDisabled) {
                    setCurrentStep(item.step);
                    setSidebarOpen(false);
                  }
                }}
                disabled={!!isDisabled}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : isDisabled
                    ? 'text-muted-foreground/40 cursor-not-allowed'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {isActive && <ChevronLeft className="w-4 h-4 mr-auto" />}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-foreground">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-foreground">
              {navItems.find(n => n.id === activePage)?.label || 'لوحة التحكم'}
            </h1>
            <div className="w-6" /> {/* spacer */}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
