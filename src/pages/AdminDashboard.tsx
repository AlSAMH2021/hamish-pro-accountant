import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users, BarChart3, CalendarDays, CheckCircle, XCircle,
  Search, Trash2, Loader2, LogOut, Shield, TrendingUp,
  BookOpen, Clock, Link2, Send, UserPlus, Copy, Eye, EyeOff,
} from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';

interface ProfileRow {
  id: string;
  user_id: string;
  name: string;
  phone: string | null;
  job_title: string | null;
  company: string | null;
  sector: string;
  payment_status: boolean;
  status: string;
  created_at: string;
}

interface ExamRow {
  id: string;
  user_id: string;
  total_score: number;
  performance_level: string;
  passed: boolean;
  completed_at: string;
}

interface BookingRow {
  id: string;
  user_id: string;
  date: string;
  time: string;
  session_completed: boolean;
  session_link: string | null;
  booked_at: string;
}

type Tab = 'stats' | 'users' | 'bookings' | 'slots';

interface SlotRow {
  id: string;
  date: string;
  day_name: string;
  time: string;
  is_active: boolean;
}

const SECTOR_MAP: Record<string, string> = {
  tourism: 'السياحة والفنادق',
  restaurants: 'المطاعم والمقاهي',
  healthcare: 'الصحة والمنشآت الطبية',
};

const AdminDashboard = () => {
  const { isAdmin, loading: roleLoading } = useIsAdmin();
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('stats');
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [exams, setExams] = useState<ExamRow[]>([]);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [linkInputs, setLinkInputs] = useState<Record<string, string>>({});
  const [adminUserIds, setAdminUserIds] = useState<Set<string>>(new Set());
  const [slots, setSlots] = useState<SlotRow[]>([]);
  const [newSlotDate, setNewSlotDate] = useState('');
  const [newSlotDay, setNewSlotDay] = useState('');
  const [newSlotTime, setNewSlotTime] = useState('');
  const [addingSlot, setAddingSlot] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [createdAdminInfo, setCreatedAdminInfo] = useState<{ email: string; password: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [p, e, b, r, s] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('exam_results').select('id, user_id, total_score, performance_level, passed, completed_at').order('completed_at', { ascending: false }),
      supabase.from('bookings').select('*').order('booked_at', { ascending: false }),
      supabase.from('user_roles').select('user_id, role').eq('role', 'admin'),
      supabase.from('available_slots').select('*').order('date', { ascending: true }),
    ]);
    setProfiles((p.data as ProfileRow[]) || []);
    setExams((e.data as ExamRow[]) || []);
    setBookings((b.data as BookingRow[]) || []);
    setAdminUserIds(new Set((r.data || []).map((row: any) => row.user_id)));
    setSlots((s.data as SlotRow[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUserId(data.user?.id ?? null));
  }, []);

  useEffect(() => {
    if (isAdmin) loadData();
  }, [isAdmin, loadData]);

  if (roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <div className="text-center space-y-4">
          <Shield className="w-16 h-16 text-destructive mx-auto" />
          <h1 className="text-2xl font-bold text-foreground">غير مصرح</h1>
          <p className="text-muted-foreground">ليس لديك صلاحية الوصول لهذه الصفحة</p>
          <Button onClick={async () => { await supabase.auth.signOut(); navigate('/'); }} variant="outline" className="rounded-xl">
            <LogOut className="w-4 h-4 ml-2" />
            تسجيل الخروج
          </Button>
        </div>
      </div>
    );
  }

  // Exclude admin users from all statistics
  const nonAdminProfiles = profiles.filter(p => !adminUserIds.has(p.user_id));
  const nonAdminExams = exams.filter(e => !adminUserIds.has(e.user_id));
  const nonAdminBookings = bookings.filter(b => !adminUserIds.has(b.user_id));

  const totalUsers = nonAdminProfiles.length;
  const paidUsers = nonAdminProfiles.filter(p => p.payment_status).length;
  const totalExams = nonAdminExams.length;
  const passedExams = nonAdminExams.filter(e => e.passed).length;
  const passRate = totalExams > 0 ? Math.round((passedExams / totalExams) * 100) : 0;
  const completedSessions = nonAdminBookings.filter(b => b.session_completed).length;
  const pendingSessions = nonAdminBookings.filter(b => !b.session_completed).length;

  const filteredProfiles = profiles.filter(p =>
    p.user_id !== currentUserId && (p.name.includes(search) || (p.company || '').includes(search) || (p.phone || '').includes(search))
  );

  const getUserExam = (userId: string) => exams.find(e => e.user_id === userId);
  const getUserBooking = (userId: string) => bookings.find(b => b.user_id === userId);

  const handleToggleSession = async (bookingId: string, current: boolean) => {
    await supabase.from('bookings').update({ session_completed: !current }).eq('id', bookingId);
    loadData();
  };

  const handleSaveLink = async (bookingId: string) => {
    const link = linkInputs[bookingId];
    if (!link?.trim()) return;
    await supabase.from('bookings').update({ session_link: link.trim() }).eq('id', bookingId);
    loadData();
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم وجميع سجلاته؟')) return;
    const { error } = await supabase.functions.invoke('delete-user', {
      body: { user_id: userId },
    });
    if (error) {
      alert('حدث خطأ أثناء الحذف');
      console.error(error);
    }
    loadData();
  };

  const handleUpdateStatus = async (userId: string, status: string) => {
    const updateData: Record<string, any> = { status };
    if (status === 'paid') {
      updateData.payment_status = true;
    }
    await supabase.from('profiles').update(updateData).eq('user_id', userId);
    loadData();
  };

  const handleToggleAdmin = async (userId: string) => {
    if (adminUserIds.has(userId)) {
      await supabase.from('user_roles').delete().eq('user_id', userId).eq('role', 'admin');
    } else {
      await supabase.from('user_roles').insert({ user_id: userId, role: 'admin' as any });
    }
    loadData();
  };

  const DAY_NAMES = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  const handleAddSlot = async () => {
    if (!newSlotDate || !newSlotTime) return;
    setAddingSlot(true);
    const dateObj = new Date(newSlotDate + 'T00:00:00');
    const dayName = newSlotDay || DAY_NAMES[dateObj.getDay()];
    await supabase.from('available_slots').insert({
      date: newSlotDate,
      day_name: dayName,
      time: newSlotTime,
    } as any);
    setNewSlotDate('');
    setNewSlotTime('');
    setNewSlotDay('');
    setAddingSlot(false);
    loadData();
  };

  const handleDeleteSlot = async (slotId: string) => {
    await supabase.from('available_slots').delete().eq('id', slotId);
    loadData();
  };

  const handleToggleSlot = async (slotId: string, currentActive: boolean) => {
    await supabase.from('available_slots').update({ is_active: !currentActive } as any).eq('id', slotId);
    loadData();
  };

  // Group slots by date
  const slotsByDate = slots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = { day_name: slot.day_name, slots: [] };
    acc[slot.date].slots.push(slot);
    return acc;
  }, {} as Record<string, { day_name: string; slots: SlotRow[] }>);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'stats', label: 'الإحصائيات', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'users', label: 'المستخدمين', icon: <Users className="w-4 h-4" /> },
    { id: 'bookings', label: 'الجلسات', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'slots', label: 'المواعيد المتاحة', icon: <Clock className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-foreground text-lg">لوحة تحكم المشرف</h1>
              <p className="text-xs text-muted-foreground">هامش — إدارة التقييمات</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <Button onClick={async () => { await supabase.auth.signOut(); navigate('/'); }} variant="outline" size="sm" className="rounded-xl gap-2">
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 bg-card rounded-2xl p-1.5 shadow-card w-fit">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === t.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats Tab */}
            {tab === 'stats' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'إجمالي المستخدمين', value: totalUsers, icon: <Users className="w-5 h-5" />, color: 'text-primary' },
                    { label: 'دفعوا', value: paidUsers, icon: <TrendingUp className="w-5 h-5" />, color: 'text-success' },
                    { label: 'أكملوا الاختبار', value: totalExams, icon: <BookOpen className="w-5 h-5" />, color: 'text-accent' },
                    { label: 'نسبة النجاح', value: `${passRate}%`, icon: <BarChart3 className="w-5 h-5" />, color: passRate >= 50 ? 'text-success' : 'text-destructive' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-card rounded-2xl shadow-card p-5">
                      <div className={`w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center mb-3 ${stat.color}`}>
                        {stat.icon}
                      </div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-card rounded-2xl shadow-card p-5">
                    <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                      <CalendarDays className="w-5 h-5 text-primary" />
                      حالة الجلسات
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                        <span className="text-sm text-muted-foreground">جلسات مكتملة</span>
                        <span className="font-bold text-success">{completedSessions}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                        <span className="text-sm text-muted-foreground">جلسات معلقة</span>
                        <span className="font-bold text-warning">{pendingSessions}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-2xl shadow-card p-5">
                    <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      توزيع القطاعات
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(SECTOR_MAP).map(([key, label]) => {
                        const count = nonAdminProfiles.filter(p => p.sector === key).length;
                        const pct = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0;
                        return (
                          <div key={key} className="p-3 rounded-xl bg-muted/30">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">{label}</span>
                              <span className="font-bold text-foreground">{count}</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-muted">
                              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {tab === 'users' && (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="بحث بالاسم أو الشركة أو الجوال..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pr-10 h-11 rounded-xl"
                    dir="auto"
                  />
                </div>

                <div className="bg-card rounded-2xl shadow-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          <th className="text-right p-3 font-medium text-muted-foreground">الاسم</th>
                          <th className="text-right p-3 font-medium text-muted-foreground">الشركة</th>
                          <th className="text-center p-3 font-medium text-muted-foreground">القطاع</th>
                          <th className="text-center p-3 font-medium text-muted-foreground">الدفع</th>
                          <th className="text-center p-3 font-medium text-muted-foreground">الاختبار</th>
                          <th className="text-center p-3 font-medium text-muted-foreground">الحالة</th>
                          <th className="text-center p-3 font-medium text-muted-foreground">مشرف</th>
                          <th className="text-center p-3 font-medium text-muted-foreground">إجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProfiles.map(p => {
                          const exam = getUserExam(p.user_id);
                          return (
                            <tr key={p.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                              <td className="p-3">
                                <p className="font-medium text-foreground">{p.name}</p>
                                <p className="text-xs text-muted-foreground">{p.phone}</p>
                              </td>
                              <td className="p-3 text-muted-foreground">{p.company || '—'}</td>
                              <td className="p-3 text-center text-xs">{SECTOR_MAP[p.sector] || p.sector}</td>
                              <td className="p-3 text-center">
                                {p.payment_status
                                  ? <CheckCircle className="w-4 h-4 text-success mx-auto" />
                                  : <XCircle className="w-4 h-4 text-muted-foreground mx-auto" />}
                              </td>
                              <td className="p-3 text-center">
                                {exam ? (
                                  <span className={`text-xs font-bold ${exam.passed ? 'text-success' : 'text-destructive'}`}>
                                    {exam.total_score}/45
                                  </span>
                                ) : <span className="text-xs text-muted-foreground">—</span>}
                              </td>
                              <td className="p-3 text-center">
                                <select
                                  value={p.status}
                                  onChange={e => handleUpdateStatus(p.user_id, e.target.value)}
                                  className="text-xs bg-muted/50 border border-border rounded-lg px-2 py-1 text-foreground"
                                >
                                  <option value="registered">مسجل</option>
                                  <option value="paid">دفع</option>
                                  <option value="exam_completed">أكمل الاختبار</option>
                                  <option value="booked">حجز جلسة</option>
                                </select>
                              </td>
                              <td className="p-3 text-center">
                                <button
                                  onClick={() => handleToggleAdmin(p.user_id)}
                                  className={`p-1.5 rounded-lg transition-colors ${adminUserIds.has(p.user_id) ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-muted/50'}`}
                                  title={adminUserIds.has(p.user_id) ? 'إزالة صلاحية المشرف' : 'منح صلاحية المشرف'}
                                >
                                  <Shield className="w-4 h-4" />
                                </button>
                              </td>
                              <td className="p-3 text-center">
                                <button
                                  onClick={() => handleDeleteUser(p.user_id)}
                                  className="text-destructive hover:bg-destructive/10 p-1.5 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        {filteredProfiles.length === 0 && (
                          <tr>
                            <td colSpan={8} className="p-8 text-center text-muted-foreground">لا توجد نتائج</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {tab === 'bookings' && (
              <div className="space-y-4">
                <div className="bg-card rounded-2xl shadow-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          <th className="text-right p-3 font-medium text-muted-foreground">المستخدم</th>
                          <th className="text-center p-3 font-medium text-muted-foreground">التاريخ</th>
                          <th className="text-center p-3 font-medium text-muted-foreground">الوقت</th>
                          <th className="text-right p-3 font-medium text-muted-foreground">رابط الجلسة</th>
                          <th className="text-center p-3 font-medium text-muted-foreground">الحالة</th>
                          <th className="text-center p-3 font-medium text-muted-foreground">إجراء</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map(b => {
                          const profile = profiles.find(p => p.user_id === b.user_id);
                          return (
                            <tr key={b.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                              <td className="p-3">
                                <p className="font-medium text-foreground">{profile?.name || 'غير معروف'}</p>
                                <p className="text-xs text-muted-foreground">{profile?.company}</p>
                              </td>
                              <td className="p-3 text-center text-foreground">{b.date}</td>
                              <td className="p-3 text-center text-foreground">{b.time}</td>
                              <td className="p-3">
                                <div className="flex items-center gap-1">
                                  <Input
                                    placeholder="الصق رابط الجلسة..."
                                    value={linkInputs[b.id] ?? b.session_link ?? ''}
                                    onChange={e => setLinkInputs(prev => ({ ...prev, [b.id]: e.target.value }))}
                                    className="h-8 text-xs min-w-[160px]"
                                    dir="auto"
                                  />
                                  <Button
                                    size="sm"
                                    onClick={() => handleSaveLink(b.id)}
                                    className="h-8 px-2 rounded-lg"
                                    disabled={!(linkInputs[b.id] ?? '').trim() || linkInputs[b.id] === b.session_link}
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              </td>
                              <td className="p-3 text-center">
                                {b.session_completed ? (
                                  <span className="inline-flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-lg">
                                    <CheckCircle className="w-3 h-3" />
                                    مكتملة
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-xs font-medium text-warning bg-warning/10 px-2 py-1 rounded-lg">
                                    <Clock className="w-3 h-3" />
                                    معلقة
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-center">
                                <Button
                                  size="sm"
                                  variant={b.session_completed ? 'outline' : 'default'}
                                  onClick={() => handleToggleSession(b.id, b.session_completed)}
                                  className="rounded-lg text-xs h-8"
                                >
                                  {b.session_completed ? 'إلغاء الإتمام' : 'تأكيد الإتمام'}
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                        {bookings.length === 0 && (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-muted-foreground">لا توجد حجوزات</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Slots Management Tab */}
            {tab === 'slots' && (
              <div className="space-y-6">
                {/* Add new slot */}
                <div className="bg-card rounded-2xl shadow-card p-6">
                  <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-primary" />
                    إضافة موعد جديد
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground mb-1 block">التاريخ</label>
                      <Input
                        type="date"
                        value={newSlotDate}
                        onChange={e => {
                          setNewSlotDate(e.target.value);
                          const d = new Date(e.target.value + 'T00:00:00');
                          setNewSlotDay(DAY_NAMES[d.getDay()] || '');
                        }}
                        className="h-11 rounded-xl"
                      />
                      {newSlotDay && (
                        <p className="text-xs text-primary mt-1">{newSlotDay}</p>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground mb-1 block">الوقت</label>
                      <Input
                        type="time"
                        value={newSlotTime}
                        onChange={e => setNewSlotTime(e.target.value)}
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        onClick={handleAddSlot}
                        disabled={!newSlotDate || !newSlotTime || addingSlot}
                        className="h-11 px-6 rounded-xl"
                      >
                        {addingSlot ? <Loader2 className="w-4 h-4 animate-spin" /> : 'إضافة'}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Existing slots grouped by date */}
                {Object.keys(slotsByDate).length === 0 ? (
                  <div className="bg-card rounded-2xl shadow-card p-8 text-center">
                    <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">لا توجد مواعيد متاحة حالياً</p>
                  </div>
                ) : (
                  Object.entries(slotsByDate)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([date, { day_name, slots: dateSlots }]) => (
                      <div key={date} className="bg-card rounded-2xl shadow-card p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <CalendarDays className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground">{day_name}</h3>
                            <p className="text-xs text-muted-foreground">{date}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {dateSlots.map(slot => (
                            <div
                              key={slot.id}
                              className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                                slot.is_active ? 'border-primary/20 bg-primary/5' : 'border-border bg-muted/30 opacity-60'
                              }`}
                            >
                              <span className={`font-bold text-sm ${slot.is_active ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {slot.time}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleToggleSlot(slot.id, slot.is_active)}
                                  className={`p-1 rounded-lg transition-colors ${
                                    slot.is_active ? 'text-success hover:bg-success/10' : 'text-muted-foreground hover:bg-muted/50'
                                  }`}
                                  title={slot.is_active ? 'تعطيل' : 'تفعيل'}
                                >
                                  {slot.is_active ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                </button>
                                <button
                                  onClick={() => handleDeleteSlot(slot.id)}
                                  className="text-destructive hover:bg-destructive/10 p-1 rounded-lg transition-colors"
                                  title="حذف"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
