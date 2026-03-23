import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateId, hashPassword, verifyPassword } from '../utils/helpers'
import { USER_ROLES } from '../utils/constants'

const DEFAULT_ADMIN = {
  id: 'default-admin',
  username: 'admin',
  password: hashPassword('admin123'),
  displayName: 'Administrador',
  role: USER_ROLES.ADMIN,
  createdAt: new Date().toISOString(),
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      users: [DEFAULT_ADMIN],
      currentUser: null,

      login: (username, password) => {
        const user = get().users.find((u) => u.username === username)
        if (!user || !verifyPassword(password, user.password)) {
          return { success: false, error: 'auth.errors.invalidCredentials' }
        }
        set({ currentUser: { ...user, password: undefined } })
        return { success: true }
      },

      logout: () => set({ currentUser: null }),

      register: (data) => {
        const { username, password, displayName } = data
        const exists = get().users.find((u) => u.username === username)
        if (exists) return { success: false, error: 'auth.errors.userExists' }
        const newUser = {
          id: generateId(),
          username,
          password: hashPassword(password),
          displayName: displayName || username,
          role: USER_ROLES.USER,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ users: [...state.users, newUser] }))
        set({ currentUser: { ...newUser, password: undefined } })
        return { success: true }
      },

      // Admin: create user
      createUser: (data) => {
        const { username, password, displayName, role } = data
        const exists = get().users.find((u) => u.username === username)
        if (exists) return { success: false, error: 'auth.errors.userExists' }
        const newUser = {
          id: generateId(),
          username,
          password: hashPassword(password || 'changeme123'),
          displayName: displayName || username,
          role: role || USER_ROLES.USER,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ users: [...state.users, newUser] }))
        return { success: true }
      },

      // Admin: update user
      updateUser: (id, data) => {
        set((state) => ({
          users: state.users.map((u) => {
            if (u.id !== id) return u
            const updated = {
              ...u,
              displayName: data.displayName ?? u.displayName,
              role: data.role ?? u.role,
            }
            if (data.password) updated.password = hashPassword(data.password)
            return updated
          }),
          // Refresh current user if editing self
          currentUser:
            state.currentUser?.id === id
              ? { ...state.currentUser, displayName: data.displayName ?? state.currentUser.displayName }
              : state.currentUser,
        }))
        return { success: true }
      },

      // Admin: delete user
      deleteUser: (id) => {
        const state = get()
        if (state.currentUser?.id === id) {
          return { success: false, error: 'users.cannotDeleteSelf' }
        }
        const admins = state.users.filter((u) => u.role === USER_ROLES.ADMIN)
        const target = state.users.find((u) => u.id === id)
        if (target?.role === USER_ROLES.ADMIN && admins.length <= 1) {
          return { success: false, error: 'users.cannotDeleteLastAdmin' }
        }
        set((state) => ({ users: state.users.filter((u) => u.id !== id) }))
        return { success: true }
      },

      // Get user display names for dropdowns
      getUserOptions: () => {
        return get().users.map((u) => ({ value: u.displayName, label: u.displayName }))
      },
    }),
    { name: 'auth-storage' }
  )
)
