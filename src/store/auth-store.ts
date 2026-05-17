import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  clearAuthCookies,
  setAuthCookies,
} from "@/lib/auth-cookies";
import { User } from "@/types/user";

interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      setAuth: (user, token) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
          setAuthCookies(token, user.role, user._id);
        }

        set({ user, token });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("auth-storage");
          clearAuthCookies();
        }

        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
