import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  username: string;
  sessionId: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, sessionId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (username: string, sessionId: string) =>
        set({ user: { username, sessionId }, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);
