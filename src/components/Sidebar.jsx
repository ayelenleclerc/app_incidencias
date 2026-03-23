import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LayoutDashboard, AlertCircle, Wrench, Users, X, ShieldCheck } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const navItems = [
  { to: '/', icon: LayoutDashboard, key: 'dashboard' },
  { to: '/incidents', icon: AlertCircle, key: 'incidents' },
  { to: '/maintenance', icon: Wrench, key: 'maintenance' },
]

export function Sidebar({ open, onClose }) {
  const { t } = useTranslation()
  const { isAdmin } = useAuth()

  const items = isAdmin
    ? [...navItems, { to: '/users', icon: Users, key: 'users' }]
    : navItems

  return (
    <>
      {/* Backdrop (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-30 w-64 flex flex-col
          bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
          sidebar-transition
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:z-auto
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-lg text-gray-900 dark:text-white">GestInn</span>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {items.map(({ to, icon: Icon, key }) => (
            <NavLink
              key={key}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {t(`nav.${key}`)}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-400 dark:text-gray-600">GestInn v1.0</p>
        </div>
      </aside>
    </>
  )
}
