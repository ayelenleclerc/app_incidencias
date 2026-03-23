import { useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Bell, Check, Trash2, AlertTriangle, Info } from 'lucide-react'
import { useNotificationStore } from '../store/notificationStore'
import { relativeTime } from '../utils/helpers'
import { NOTIFICATION_TYPE } from '../utils/constants'

export function NotificationPanel({ open, onClose }) {
  const { t } = useTranslation()
  const { notifications, markRead, markAllRead, remove, unreadCount } = useNotificationStore()
  const panelRef = useRef(null)
  const count = unreadCount()

  useEffect(() => {
    function handle(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose()
      }
    }
    if (open) document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open, onClose])

  if (!open) return null

  const icon = (type) => {
    if (type === NOTIFICATION_TYPE.OVERDUE) return <AlertTriangle className="w-4 h-4 text-red-500" />
    return <Info className="w-4 h-4 text-blue-500" />
  }

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <span className="font-semibold text-sm text-gray-900 dark:text-white">
          {t('common.notifications')}
          {count > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{count}</span>
          )}
        </span>
        {notifications.length > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            {t('common.markAllRead')}
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-gray-400 dark:text-gray-600">
            <Bell className="w-8 h-8 mb-2" />
            <p className="text-sm">{t('common.noNotifications')}</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0 transition-colors ${
                !n.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">{icon(n.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 dark:text-gray-200 leading-snug">{n.message}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{relativeTime(n.createdAt)}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                {!n.read && (
                  <button
                    onClick={() => markRead(n.id)}
                    className="p-1 rounded text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    title="Marcar como leída"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => remove(n.id)}
                  className="p-1 rounded text-gray-400 hover:text-red-500"
                  title="Eliminar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
