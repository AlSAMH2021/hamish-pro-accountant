import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

const SLOTS = [
  { date: '2026-04-07', day: 'الإثنين', times: ['10:00', '11:00', '14:00', '16:00'] },
  { date: '2026-04-08', day: 'الثلاثاء', times: ['09:00', '11:00', '13:00', '15:00'] },
  { date: '2026-04-09', day: 'الأربعاء', times: ['10:00', '12:00', '14:00'] },
  { date: '2026-04-10', day: 'الخميس', times: ['09:00', '11:00', '13:00'] },
];

const Booking = () => {
  const { setBooking, setCurrentStep, updateUserStatus } = useApp();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const handleBook = () => {
    setBooking({ date: selectedDate, time: selectedTime, bookedAt: new Date().toISOString() });
    updateUserStatus('booked');
    setConfirmed(true);
    setTimeout(() => setCurrentStep(8), 2000);
  };

  const selectedSlot = SLOTS.find((s) => s.date === selectedDate);

  if (confirmed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <CheckCircle className="w-24 h-24 text-success mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-2">تم الحجز بنجاح!</h1>
          <p className="text-muted-foreground">جاري تحويلك للتقرير...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">احجز جلستك الاستشارية</h1>
          <p className="text-muted-foreground">اختر الموعد المناسب لك مع خبير المحاسبة</p>
        </div>

        <div className="bg-card rounded-2xl shadow-card p-8">
          {/* Date Selection */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              اختر اليوم
            </h2>
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
                  <p className="font-bold text-foreground">{slot.day}</p>
                  <p className="text-sm text-muted-foreground">{slot.date.split('-').slice(1).join('/')}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          {selectedSlot && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                اختر الوقت
              </h2>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {selectedSlot.times.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-3 rounded-xl border-2 text-center font-bold transition-all ${
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
      </div>
    </div>
  );
};

export default Booking;
