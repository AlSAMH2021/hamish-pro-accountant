import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import StepperLayout from '@/components/StepperLayout';
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
      <StepperLayout activePage="booking">
        <div className="max-w-lg mx-auto space-y-5">
          <div className="bg-card rounded-2xl shadow-card p-6 text-center">
            <CheckCircle className="w-14 h-14 text-success mx-auto mb-3" />
            <h2 className="text-xl font-bold text-foreground mb-1">تم حجز جلستك بنجاح</h2>
            <p className="text-muted-foreground text-sm">سيتم التواصل معك لتأكيد الموعد</p>
          </div>

          <div className="bg-card rounded-2xl shadow-card p-5 space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
              <Calendar className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">التاريخ</p>
                <p className="text-foreground font-medium text-sm">{bookingDay} - {booking.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
              <Clock className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">الوقت</p>
                <p className="text-foreground font-medium text-sm">{booking.time}</p>
              </div>
            </div>
            {booking.sessionLink && (
              <a
                href={booking.sessionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border-2 border-primary/20 hover:border-primary/40 transition-all"
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
      </StepperLayout>
    );
  }

  return (
    <StepperLayout activePage="booking">
      <div className="max-w-lg mx-auto space-y-5">
        <div className="bg-card rounded-2xl shadow-card p-5 text-center">
          <Calendar className="w-10 h-10 text-primary mx-auto mb-2" />
          <h2 className="text-lg font-bold text-foreground">احجز جلستك الاستشارية</h2>
          <p className="text-muted-foreground text-sm">اختر الموعد المناسب لك</p>
        </div>

        {loadingSlots ? (
          <div className="bg-card rounded-2xl shadow-card p-8 flex justify-center">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : SLOTS.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-card p-8 text-center">
            <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">لا توجد مواعيد متاحة حالياً</p>
          </div>
        ) : (
          <>
            {/* Date Selection */}
            <div className="bg-card rounded-2xl shadow-card p-5">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                اختر اليوم
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SLOTS.map((slot) => (
                  <button
                    key={slot.date}
                    onClick={() => { setSelectedDate(slot.date); setSelectedTime(''); }}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      selectedDate === slot.date ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <p className="font-bold text-foreground text-sm">{slot.day}</p>
                    <p className="text-xs text-muted-foreground">{slot.date.split('-').slice(1).join('/')}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            {selectedSlot && (
              <div className="bg-card rounded-2xl shadow-card p-5 animate-fade-in-up">
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  اختر الوقت
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {selectedSlot.times.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-2.5 rounded-xl border-2 text-center font-bold text-sm transition-all ${
                        selectedTime === time ? 'border-primary bg-primary/5 text-foreground' : 'border-border text-muted-foreground hover:border-primary/30'
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
              className="w-full h-12 text-base font-bold bg-gradient-primary text-primary-foreground rounded-xl disabled:opacity-50"
            >
              تأكيد الحجز
            </Button>
          </>
        )}
      </div>
    </StepperLayout>
  );
};

export default Booking;
