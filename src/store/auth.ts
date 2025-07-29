import { create } from "zustand";

type AuthState = {
  phone: string;
  dialCode: string;
  country: string;
  isLoggedIn: boolean;
  login: (data: { phone: string; dialCode: string; country: string }) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  phone: "",
  dialCode: "",
  country: "",
  isLoggedIn: false,
  login: ({ phone, dialCode, country }) => {
    const authData = { phone, dialCode, country };
    localStorage.setItem("auth", JSON.stringify(authData));
    set({ ...authData, isLoggedIn: true });
  },
  logout: () => {
    localStorage.removeItem("auth");
    set({ phone: "", dialCode: "", country: "", isLoggedIn: false });
  },
}));
