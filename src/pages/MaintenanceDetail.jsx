import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Pencil, Trash2, CheckCircle, User, Calendar, Repeat, MapPin, Cpu } from 'lucide-react'
import { useMaintenanceStore } from '../store/maintenanceStore'
import { MaintenanceStatusBadge } from '../components/StatusBadge'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { useState } from 'react'
import { formatDate, daysUntil } from '../utils/helpers'
import { MAINTENANCE_STATUS } from '../utils/constants'

export default function MaintenanceDetail() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const task = useMaintenanceStore((s) => s.getById(id))
  const remove = useMaintenanceStore((s) => s.remove)
  const complete = useMaintenanceStore((s) => s.complete)
  const update = useMaintenanceStore((s) => s.update)
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!task) return (
    <div className="text-center py-16 text-gray-400 dark:text-gray-600">
      <p>Mantenimiento no encontrado.</p>
      <Link to="/maintenance" className="text-blue-600 dark:text-blue-400 hover:underline text-sm mt-2 inline-block">Volver</Link>
    </div>
  )

  const days = daysUntil(task.nextDueDate)
  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3">
      <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 flex-shrink-0">
        <Icon className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
      </div>
      <div>
        <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
        <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{value || '-'}</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-2">
          <Link to={`/maintenance/${id}/edit`} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Pencil className="w-4 h-4" />
            {t('common.edit')}
          </Link>
          <button onClick={() => setConfirmDelete(true)} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <MaintenanceStatusBadge status={task.status} />
          {task.nextDueDate && task.status !== MAINTENANCE_STATUS.COMPLETED && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              days !== null && days < 0 ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
              days === 0 ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600' :
              days !== null && days <= 7 ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700' :
              'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}>
              {days === null ? '' :
               days < 0 ? t('maintenance.daysOverdue', { days: Math.abs(days) }) :
               days === 0 ? t('maintenance.dueToday') :
               t('maintenance.daysUntil', { days })}
            </span>
          )}
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{task.title}</h2>
        {task.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap mb-5">{task.description}</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <InfoRow icon={User} label={t('maintenance.fields.responsible')} value={task.responsible} />
          <InfoRow icon={Repeat} label={t('maintenance.fields.frequency')} value={t(`maintenance.frequency.${task.frequency}`)} />
          <InfoRow icon={Calendar} label={t('maintenance.fields.nextDueDate')} value={formatDate(task.nextDueDate)} />
          <InfoRow icon={Calendar} label={t('maintenance.fields.lastCompletedDate')} value={formatDate(task.lastCompletedDate)} />
          <InfoRow icon={Cpu} label={t('maintenance.fields.equipment')} value={task.equipment} />
          <InfoRow icon={MapPin} label={t('maintenance.fields.area')} value={task.area} />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
          {task.status !== MAINTENANCE_STATUS.IN_PROGRESS && task.status !== MAINTENANCE_STATUS.COMPLETED && (
            <button onClick={() => update(id, { status: MAINTENANCE_STATUS.IN_PROGRESS })} className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-100">
              Iniciar mantenimiento
            </button>
          )}
          {task.status !== MAINTENANCE_STATUS.COMPLETED && (
            <button onClick={() => complete(id)} className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30">
              <CheckCircle className="w-3.5 h-3.5" />
              {t('maintenance.complete')}
            </button>
          )}
          {task.status === MAINTENANCE_STATUS.COMPLETED && (
            <button onClick={() => update(id, { status: MAINTENANCE_STATUS.PENDING })} className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100">
              Marcar como pendiente
            </button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title={t('maintenance.deleteConfirm')}
        description={t('maintenance.deleteConfirmDesc')}
        onConfirm={() => { remove(id); navigate('/maintenance') }}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  )
}
