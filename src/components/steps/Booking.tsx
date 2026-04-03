import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/DashboardLayout';
import { Calendar, Clock, CheckCircle, Video } from 'lucide-react';

const SLOTS = [
  { date: '2026-04-07', day: 'الإثنين', times: ['10:00', '11:00', '14:00', '16:00'] },
  { date: '2026-04-08', day: 'الثلاثاء', times: ['09:00', '11:00', '13:00', '15:00'] },
  { date: '2026-04-09', day: 'الأربعاء', times: ['10:00', '12:00', '14:00'] },
  { date: '2026-04-10', day: 'الخميس', times: ['09:00', '11:00', '13:00'] },
];

const Booking = () => {
  const { setBooking, setCurrentStep, updateUserStatus, booking } = useApp();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

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
