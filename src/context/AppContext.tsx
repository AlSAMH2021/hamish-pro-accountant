import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserData, ExamResult, BookingData } from '@/data/types';

interface AppState {
  currentStep: number;
  user: UserData | null;
  examResult: ExamResult | null;
  booking: BookingData | null;
  registeredUsers: UserData[];
  setCurrentStep: (step: number) => void;
  setUser: (user: UserData) => void;
  updateUserStatus: (status: UserData['status']) => void;
  setPaymentStatus: (paid: boolean) => void;
  setExamResult: (result: ExamResult) => void;
  setBooking: (booking: BookingData) => void;
  canAccessStep: (step: number) => boolean;
  loginUser: (email: string, password: string) => boolean;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [user, setUser] = useState<UserData | null>(null);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [booking, setBooking] = useState<BookingData | null>(null);

  const updateUserStatus = (status: UserData['status']) => {
    if (user) setUser({ ...user, status });
  };

  const setPaymentStatus = (paid: boolean) => {
    if (user) setUser({ ...user, paymentStatus: paid, status: paid ? 'paid' : user.status });
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
      case 8: return !!booking;
      default: return false;
    }
  };

  return (
    <AppContext.Provider value={{
      currentStep, user, examResult, booking,
      setCurrentStep, setUser, updateUserStatus, setPaymentStatus,
      setExamResult, setBooking, canAccessStep,
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
