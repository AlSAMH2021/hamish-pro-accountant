import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserData, ExamResult, BookingData, Sector } from '@/data/types';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

interface AppState {
  currentStep: number;
  user: UserData | null;
  examResult: ExamResult | null;
  booking: BookingData | null;
  sessionCompleted: boolean;
  session: Session | null;
  loading: boolean;
  setCurrentStep: (step: number) => void;
  setUser: (user: UserData) => void;
  updateUserStatus: (status: UserData['status']) => void;
  setPaymentStatus: (paid: boolean) => void;
  setExamResult: (result: ExamResult) => void;
  setBooking: (booking: BookingData) => void;
  setSessionCompleted: (completed: boolean) => void;
  canAccessStep: (step: number) => boolean;
  signUp: (email: string, password: string, metadata: Record<string, string>) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [user, setUserState] = useState<UserData | null>(null);
  const [examResult, setExamResultState] = useState<ExamResult | null>(null);
  const [booking, setBookingState] = useState<BookingData | null>(null);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        if (newSession?.user) {
          // Defer data loading to avoid deadlock
          setTimeout(() => loadUserData(newSession.user.id), 0);
        } else {
          setUserState(null);
          setExamResultState(null);
          setBookingState(null);
          setSessionCompleted(false);
          setCurrentStep(1);
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (currentSession?.user) {
        loadUserData(currentSession.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      // Check if user is admin - if so, redirect to admin dashboard
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (roleData) {
        // Admin user - redirect to admin dashboard
        setLoading(false);
        if (window.location.pathname !== '/admin') {
          window.location.href = '/admin';
        }
        return;
      }

      // Load profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profile) {
        const userData: UserData = {
          name: profile.name,
          email: session?.user?.email || '',
          phone: profile.phone || '',
          jobTitle: profile.job_title || '',
          company: profile.company || '',
          sector: profile.sector as Sector,
          password: '',
          status: profile.status as UserData['status'],
          paymentStatus: profile.payment_status,
        };
        setUserState(userData);

        // Load exam result
        const { data: examData } = await supabase
          .from('exam_results')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (examData) {
          setExamResultState({
            answers: examData.answers as Record<number, number>,
            axisScores: examData.axis_scores as Record<string, number>,
            totalScore: examData.total_score,
            performanceLevel: examData.performance_level as ExamResult['performanceLevel'],
            passed: examData.passed,
            axisPassed: examData.axis_passed as Record<string, boolean>,
            completedAt: examData.completed_at,
          } as ExamResult);
        }

        // Load booking
        const { data: bookingData } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (bookingData) {
          setBookingState({
            date: bookingData.date,
            time: bookingData.time,
            bookedAt: bookingData.booked_at,
            sessionLink: bookingData.session_link || undefined,
            expertName: (bookingData as any).expert_name || undefined,
          });
          setSessionCompleted(bookingData.session_completed);
        }

        // Determine step
        if (bookingData?.session_completed) setCurrentStep(8);
        else if (bookingData) setCurrentStep(7);
        else if (examData) setCurrentStep(6);
        else if (profile.payment_status && profile.nda_accepted) setCurrentStep(5);
        else if (profile.payment_status) setCurrentStep(12);
        else setCurrentStep(3);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setUser = (userData: UserData) => {
    setUserState(userData);
  };

  const updateUserStatus = async (status: UserData['status']) => {
    if (!user || !session?.user) return;
    setUserState({ ...user, status });
    await supabase
      .from('profiles')
      .update({ status })
      .eq('user_id', session.user.id);
  };

  const setPaymentStatus = async (paid: boolean) => {
    if (!user || !session?.user) return;
    const newUser = { ...user, paymentStatus: paid, status: paid ? 'paid' as const : user.status };
    setUserState(newUser);
    await supabase
      .from('profiles')
      .update({ payment_status: paid, status: paid ? 'paid' : user.status })
      .eq('user_id', session.user.id);
  };

  const setExamResult = async (result: ExamResult) => {
    setExamResultState(result);
    if (!session?.user) return;
    await supabase.from('exam_results').insert({
      user_id: session.user.id,
      total_score: result.totalScore,
      performance_level: result.performanceLevel,
      passed: result.passed,
      axis_scores: result.axisScores as any,
      axis_passed: result.axisPassed as any,
      answers: result.answers as any,
      completed_at: result.completedAt,
    });
    await supabase
      .from('profiles')
      .update({ status: 'exam_completed' })
      .eq('user_id', session.user.id);
  };

  const setBooking = async (bookingData: BookingData) => {
    setBookingState(bookingData);
    if (!session?.user) return;
    await supabase.from('bookings').insert({
      user_id: session.user.id,
      date: bookingData.date,
      time: bookingData.time,
      booked_at: bookingData.bookedAt,
      expert_name: bookingData.expertName || null,
    });
    await supabase
      .from('profiles')
      .update({ status: 'booked' })
      .eq('user_id', session.user.id);
  };

  const canAccessStep = (step: number): boolean => {
    switch (step) {
      case 1: return true;
      case 2: return true;
      case 3: return !!user;
      case 4: return !!user;
      case 5: return !!user && user.paymentStatus;
      case 6: return !!examResult;
      case 7: return !!examResult;
      case 8: return !!examResult;
      default: return false;
    }
  };

  const signUp = async (email: string, password: string, metadata: Record<string, string>) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: 'https://assesment.hameash.com',
      },
    });
    if (error) return { error: error.message };

    // Update profile with full data after signup
    const { data: { session: newSession } } = await supabase.auth.getSession();
    if (newSession?.user) {
      await supabase
        .from('profiles')
        .update({
          name: metadata.name,
          phone: metadata.phone,
          sector: metadata.sector || 'tourism',
        })
        .eq('user_id', newSession.user.id);
    }

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://assesment.hameash.com/reset-password',
    });
    if (error) return { error: error.message };
    return { error: null };
  };

  return (
    <AppContext.Provider value={{
      currentStep, user, examResult, booking, sessionCompleted, session, loading,
      setCurrentStep, setUser, updateUserStatus, setPaymentStatus,
      setExamResult, setBooking, setSessionCompleted, canAccessStep,
      signUp, signIn, signOut, resetPassword,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
