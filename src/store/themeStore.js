import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useThemeStore = create(
  persist(
    (set) => ({
      darkMode: false,
      toggle: () =>
        set((state) => {
          const next = !state.darkMode
          if (next) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
          return { darkMode: next }
        }),
      init: () =>
        set((state) => {
          if (state.darkMode) {
            document.documentElement.classList.add('dark')
          }
          return state
        }),
    }),
    { name: 'theme-storage' }
  )
)
