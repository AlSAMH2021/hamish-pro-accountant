import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/DashboardLayout';
import { Calendar, Clock, CheckCircle, Video, Loader2 } from 'lucide-react';

interface SlotData {
  date: string;
  day_name: string;
  time: string;
}

const Booking = () => {
  const { setBooking, setCurrentStep, updateUserStatus, booking } = useApp();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [slotsData, setSlotsData] = useState<SlotData[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);

  useEffect(() => {
    const fetchSlots = async () => {
      const { data } = await supabase
        .from('available_slots')
        .select('date, day_name, time')
        .eq('is_active', true)
        .order('date', { ascending: true });
      setSlotsData((data as SlotData[]) || []);
      setLoadingSlots(false);
    };
    fetchSlots();
  }, []);

  // Group slots by date
  const SLOTS = Object.values(
    slotsData.reduce((acc, slot) => {
      if (!acc[slot.date]) acc[slot.date] = { date: slot.date, day: slot.day_name, times: [] };
      acc[slot.date].times.push(slot.time);
      return acc;
    }, {} as Record<string, { date: string; day: string; times: string[] }>)
  );

  const handleBook = () => {
    setBooking({ date: selectedDate, time: selectedTime, bookedAt: new Date().toISOString() });
    updateUserStatus('booked');
  };

  const selectedSlot = SLOTS.find((s) => s.date === selectedDate);

  if (booking) {
    const bookingDay = SLOTS.find(s => s.date === booking.date)?.day || '';
    return (
      <DashboardLayout activePage="booking">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-card rounded-2xl shadow-card p-6 text-center">
            <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-1">تم حجز جلستك بنجاح</h2>
            <p className="text-muted-foreground text-sm">سيتم التواصل معك لتأكيد الموعد</p>
          </div>

          <div className="bg-card rounded-2xl shadow-card p-6 space-y-4">
            <h3 className="text-base font-bold text-foreground">تفاصيل الموعد</h3>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30">
              <Calendar className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">التاريخ</p>
                <p className="text-foreground font-medium">{bookingDay} - {booking.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30">
              <Clock className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">الوقت</p>
                <p className="text-foreground font-medium">{booking.time}</p>
              </div>
            </div>

            {booking.sessionLink && (
              <a
                href={booking.sessionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border-2 border-primary/20 hover:border-primary/40 transition-all"
              >
                <Video className="w-5 h-5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">رابط الجلسة</p>
                  <p className="text-primary font-medium text-sm truncate">{booking.sessionLink}</p>
                </div>
              </a>
            )}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activePage="booking">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-card rounded-2xl shadow-card p-6">
          <h2 className="text-lg font-bold text-foreground mb-2">احجز جلستك الاستشارية</h2>
          <p className="text-muted-foreground text-sm">اختر الموعد المناسب لك مع خبير المحاسبة</p>
        </div>

        {loadingSlots ? (
          <div className="bg-card rounded-2xl shadow-card p-8 flex justify-center">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : SLOTS.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-card p-8 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">لا توجد مواعيد متاحة حالياً</p>
          </div>
        ) : (
        <div className="bg-card rounded-2xl shadow-card p-6">
          <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            اختر اليوم
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SLOTS.map((slot) => (
              <button
                key={slot.date}
                onClick={() => { setSelectedDate(slot.date); setSelectedTime(''); }}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  selectedDate === slot.date
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30'
                }`}
              >
                <p className="font-bold text-foreground text-sm">{slot.day}</p>
                <p className="text-xs text-muted-foreground mt-1">{slot.date.split('-').slice(1).join('/')}</p>
              </button>
            ))}
          </div>
        </div>

        {selectedSlot && (
          <div className="bg-card rounded-2xl shadow-card p-6 animate-fade-in-up">
            <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              اختر الوقت
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {selectedSlot.times.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 rounded-xl border-2 text-center font-bold text-sm transition-all ${
                    selectedTime === time
                      ? 'border-primary bg-primary/5 text-foreground'
                      : 'border-border text-muted-foreground hover:border-primary/30'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={handleBook}
          disabled={!selectedDate || !selectedTime}
          className="w-full h-14 text-lg font-bold bg-gradient-primary text-primary-foreground rounded-xl disabled:opacity-50"
        >
          تأكيد الحجز
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default Booking;
