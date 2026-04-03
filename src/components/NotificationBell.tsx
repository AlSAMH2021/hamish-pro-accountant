import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const loadNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    if (data) setNotifications(data as Notification[]);
  };

  useEffect(() => {
    loadNotifications();

    const channel = supabase
      .channel('notifications-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
        loadNotifications();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const markAllRead = async () => {
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
    if (unreadIds.length === 0) return;
    await supabase.from('notifications').update({ is_read: true }).in('id', unreadIds);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 lg:right-0 lg:left-auto top-full mt-2 w-80 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="font-bold text-foreground text-sm">الإشعارات</h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-primary hover:underline">
                تحديد الكل كمقروء
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-sm">
                لا توجد إشعارات
              </div>
            ) : (
              notifications.map(n => (
                <button
                  key={n.id}
                  onClick={() => !n.is_read && markAsRead(n.id)}
                  className={`w-full text-right px-4 py-3 border-b border-border/50 last:border-0 transition-colors ${
                    n.is_read ? 'bg-transparent' : 'bg-primary/5'
                  } hover:bg-muted/30`}
                >
                  <div className="flex items-start gap-2">
                    {!n.is_read && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                    <div className={`flex-1 ${n.is_read ? 'mr-4' : ''}`}>
                      <p className="text-sm font-medium text-foreground">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground/70 mt-1">
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: ar })}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
