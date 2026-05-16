import { create } from "zustand";

import { persist } from "zustand/middleware";

import { User } from "@/types/user";

interface AuthStore {

  user: User | null;

  token: string | null;

  setAuth: (
    user: User,
    token: string
  ) => void;

  logout: () => void;
}

export const useAuthStore =
  create<AuthStore>()(

    persist(

      (set) => ({

        user: null,

        token: null,

        setAuth: (
          user,
          token
        ) => {

          localStorage.setItem(
            "token",
            token
          );

          set({
            user,
            token,
          });
        },

        logout: () => {

          localStorage.removeItem(
            "token"
          );

          document.cookie =
            "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

          set({
            user: null,
            token: null,
          });
        },
      }),

      {
        name: "auth-storage",
      }
    )
  );