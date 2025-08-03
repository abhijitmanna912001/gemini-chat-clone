import { create } from "zustand";

type User = {
  id: string;
  email: string;
  name?: string;
  phone: string;
  dialCode: string;
  country: string;
};

type AuthStore = {
  user: User | null;
  isLoggedIn: boolean;
  isHydrated: boolean;
  login: (user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoggedIn: false,
  isHydrated: false,
  login: (user) => set({ user, isLoggedIn: true }),
  logout: () => set({ user: null, isLoggedIn: false }),
}));
