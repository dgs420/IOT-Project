import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
    persist(
        (set) => ({
            token: null,
            refreshToken: null,
            uid: null,
            email: null,
            username: null,
            role: null,

            setUser: ({ token, refreshToken, uid, email, username, role }) =>
                set({ token, refreshToken, uid, email, username, role }),

            clearUser: () =>
                set({
                    token: null,
                    refreshToken: null,
                    uid: null,
                    email: null,
                    username: null,
                    role: null,
                }),
        }),
        {
            name: "user-storage",
        }
    )
);

export default useUserStore;
