import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateId } from '../utils/helpers'

export const useNotificationStore = create(
  persist(
    (set, get) => ({
      notifications: [],

      add: (notification) => {
        const newNotif = {
          id: generateId(),
          read: false,
          createdAt: new Date().toISOString(),
          ...notification,
        }
        set((state) => ({
          notifications: [newNotif, ...state.notifications].slice(0, 50), // keep last 50
        }))
      },

      markRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      remove: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      clear: () => set({ notifications: [] }),

      unreadCount: () => get().notifications.filter((n) => !n.read).length,
    }),
    { name: 'notifications-storage' }
  )
)
