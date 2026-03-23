import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Menu, Sun, Moon, Bell, LogOut, Globe, ChevronDown } from 'lucide-react'
import { useThemeStore } from '../store/themeStore'
import { useNotificationStore } from '../store/notificationStore'
import { useAuth } from '../hooks/useAuth'
import { NotificationPanel } from './NotificationPanel'

export function TopBar({ onMenuClick, title }) {
  const { t, i18n } = useTranslation()
  const { darkMode, toggle } = useThemeStore()
  const { currentUser, logout } = useAuth()
  const notifications = useNotificationStore((s) => s.notifications)
  const unreadCount = useNotificationStore((s) => s.unreadCount)
  const [notifOpen, setNotifOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const count = unreadCount()

  const toggleLanguage = () => {
    const next = i18n.language === 'es' ? 'en' : 'es'
    i18n.changeLanguage(next)
    localStorage.setItem('language', next)
  }

  return (
    <header className="h-14 flex items-center justify-between px-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="font-semibold text-gray-900 dark:text-white text-base">{title}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        {/* Language */}
        <button
          onClick={toggleLanguage}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 flex items-center gap-1 text-xs font-medium"
          title={t('common.language')}
        >
          <Globe className="w-4 h-4" />
          <span className="uppercase">{i18n.language}</span>
        </button>

        {/* Theme */}
        <button
          onClick={toggle}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400"
          title={darkMode ? t('common.lightMode') : t('common.darkMode')}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen((v) => !v); setUserMenuOpen(false) }}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 relative"
          >
            <Bell className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </button>
          <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>

        {/* User menu */}
        <div className="relative ml-1">
          <button
            onClick={() => { setUserMenuOpen((v) => !v); setNotifOpen(false) }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {currentUser?.displayName?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block max-w-24 truncate">
              {currentUser?.displayName}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
              <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{currentUser?.displayName}</p>
                <p className="text-xs text-gray-400">{currentUser?.username}</p>
              </div>
              <button
                onClick={() => { logout(); setUserMenuOpen(false) }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {t('auth.logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
