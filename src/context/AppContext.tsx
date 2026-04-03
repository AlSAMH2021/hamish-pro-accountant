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
  const [registeredUsers, setRegisteredUsers] = useState<UserData[]>([]);

  const originalSetUser = (userData: UserData) => {
    setUser(userData);
    setRegisteredUsers(prev => {
      const exists = prev.find(u => u.email === userData.email);
      if (exists) return prev.map(u => u.email === userData.email ? userData : u);
      return [...prev, userData];
    });
  };

  const loginUser = (email: string, password: string): boolean => {
    const found = registeredUsers.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      // Resume based on status
      if (found.status === 'booked') setCurrentStep(8);
      else if (found.status === 'exam_completed') setCurrentStep(6);
      else if (found.status === 'paid') setCurrentStep(5);
      else setCurrentStep(3);
      return true;
    }
    return false;
  };

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
      currentStep, user, examResult, booking, registeredUsers,
      setCurrentStep, setUser: originalSetUser, updateUserStatus, setPaymentStatus,
      setExamResult, setBooking, canAccessStep, loginUser,
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
