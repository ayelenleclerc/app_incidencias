import { useAuthStore } from '../store/authStore'
import { USER_ROLES } from '../utils/constants'

export function useAuth() {
  const { currentUser, login, logout, register } = useAuthStore()

  return {
    currentUser,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === USER_ROLES.ADMIN,
    login,
    logout,
    register,
  }
}
