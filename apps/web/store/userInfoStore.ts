import { create } from 'zustand'

interface UserInfoState {
  id?: string;
  email?: string;
  fullName?: string;
  isInitialized: boolean;
  setUserInfo: (info: { id?: string; email?: string; fullname?: string }) => void;
  setInitialized: (val: boolean) => void;
}

export const useUserInfoStore = create<UserInfoState>((set) => ({
  id: undefined,
  email: undefined,
  fullName: undefined,
  isInitialized: false,
  setUserInfo: (info) => set((state) => ({ ...state, ...info })),
  setInitialized: (val) => set({ isInitialized: val }),
}))