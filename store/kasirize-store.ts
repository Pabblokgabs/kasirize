// store/kasirize-store.ts
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AuthUser } from "@/lib/auth";
import { UserRole } from "@/constants/roles";

interface KasirizeStore {
  // Auth / session
  authUser: AuthUser | null;
  role: UserRole;
  isGuest: boolean;

  // Actions
  setAuthUser: (user: AuthUser) => void;
  setRole: (role: UserRole) => void;
  setGuest: (guest: boolean) => void;
  logout: () => void;
}

export const useKasirizeStore = create<KasirizeStore>()(
  persist(
    (set) => ({
      authUser: null,
      role: "role-user",
      isGuest: false,

      setAuthUser: (user) =>
        set({ authUser: user, role: user.role, isGuest: user.isGuest ?? false }),

      setRole: (role) => set({ role }),

      setGuest: (isGuest) => set({ isGuest }),

      logout: () =>
        set({ authUser: null, role: "role-user", isGuest: false }),
    }),
    {
      name: "kasirize-session",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        authUser: state.authUser,
        role: state.role,
        isGuest: state.isGuest,
      }),
    },
  ),
);
