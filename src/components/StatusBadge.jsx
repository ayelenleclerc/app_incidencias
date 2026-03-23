import { useTranslation } from 'react-i18next'
import {
  INCIDENT_STATUS_COLORS,
  MAINTENANCE_STATUS_COLORS,
  PRIORITY_COLORS,
} from '../utils/constants'

export function IncidentStatusBadge({ status }) {
  const { t } = useTranslation()
  const colors = INCIDENT_STATUS_COLORS[status] || { bg: 'bg-gray-100', text: 'text-gray-600' }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
      {t(`incidents.status.${status}`, status)}
    </span>
  )
}

export function MaintenanceStatusBadge({ status }) {
  const { t } = useTranslation()
  const colors = MAINTENANCE_STATUS_COLORS[status] || { bg: 'bg-gray-100', text: 'text-gray-600' }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
      {t(`maintenance.status.${status}`, status)}
    </span>
  )
}

export function PriorityBadge({ priority }) {
  const { t } = useTranslation()
  const colors = PRIORITY_COLORS[priority] || { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-400', dot: 'bg-gray-400' }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {t(`incidents.priority.${priority}`, priority)}
    </span>
  )
}
