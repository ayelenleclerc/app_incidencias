import { useEffect } from 'react'
import { useMaintenanceStore } from '../store/maintenanceStore'
import { useNotificationStore } from '../store/notificationStore'
import { NOTIFICATION_TYPE } from '../utils/constants'

export function useOverdueCheck() {
  const checkOverdue = useMaintenanceStore((s) => s.checkOverdue)
  const addNotification = useNotificationStore((s) => s.add)

  useEffect(() => {
    const check = () => {
      const newlyOverdue = checkOverdue()
      newlyOverdue.forEach((task) => {
        addNotification({
          type: NOTIFICATION_TYPE.OVERDUE,
          message: `Mantenimiento vencido: ${task.title}`,
          relatedId: task.id,
          relatedType: 'maintenance',
        })
      })
    }

    check() // Run immediately on mount
    const interval = setInterval(check, 60000) // Then every minute
    return () => clearInterval(interval)
  }, [checkOverdue, addNotification])
}
