import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Save } from 'lucide-react'
import { useIncidentsStore } from '../store/incidentsStore'
import { useNotificationStore } from '../store/notificationStore'
import { useAuth } from '../hooks/useAuth'
import { useAuthStore } from '../store/authStore'
import { FormField, inputClass, selectClass, textareaClass } from '../components/FormField'
import { INCIDENT_PRIORITY, INCIDENT_STATUS, INCIDENT_CATEGORIES, NOTIFICATION_TYPE } from '../utils/constants'

export default function IncidentForm() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const { currentUser } = useAuth()
  const users = useAuthStore((s) => s.users)
  const addIncident = useIncidentsStore((s) => s.add)
  const updateIncident = useIncidentsStore((s) => s.update)
  const getById = useIncidentsStore((s) => s.getById)
  const addNotification = useNotificationStore((s) => s.add)

  const [form, setForm] = useState({
    title: '', description: '', priority: INCIDENT_PRIORITY.MEDIUM,
    status: INCIDENT_STATUS.OPEN, category: '', assignedTo: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isEdit) {
      const incident = getById(id)
      if (!incident) { navigate('/incidents'); return }
      setForm({
        title: incident.title,
        description: incident.description,
        priority: incident.priority,
        status: incident.status,
        category: incident.category,
        assignedTo: incident.assignedTo,
      })
    }
  }, [id])

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((e) => ({ ...e, [field]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = t('auth.errors.required')
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    if (isEdit) {
      const prev = getById(id)
      updateIncident(id, form)
      if (prev.status !== form.status) {
        addNotification({
          type: NOTIFICATION_TYPE.STATUS_CHANGE,
          message: `Incidencia "${form.title}" cambió a ${t(`incidents.status.${form.status}`)}`,
          relatedId: id,
          relatedType: 'incident',
        })
      }
    } else {
      addIncident(form, currentUser?.displayName)
    }
    navigate('/incidents')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {isEdit ? t('incidents.edit') : t('incidents.new')}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
        <FormField label={t('incidents.fields.title')} required error={errors.title}>
          <input type="text" value={form.title} onChange={set('title')} className={inputClass} placeholder="Ej: Servidor caído en sala de servidores" />
        </FormField>

        <FormField label={t('incidents.fields.description')}>
          <textarea value={form.description} onChange={set('description')} className={textareaClass} rows={4} placeholder="Describe el problema detalladamente..." />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label={t('incidents.fields.priority')} required>
            <select value={form.priority} onChange={set('priority')} className={selectClass}>
              {Object.values(INCIDENT_PRIORITY).map(p => (
                <option key={p} value={p}>{t(`incidents.priority.${p}`)}</option>
              ))}
            </select>
          </FormField>

          {isEdit && (
            <FormField label={t('incidents.fields.status')}>
              <select value={form.status} onChange={set('status')} className={selectClass}>
                {Object.values(INCIDENT_STATUS).map(s => (
                  <option key={s} value={s}>{t(`incidents.status.${s}`)}</option>
                ))}
              </select>
            </FormField>
          )}

          <FormField label={t('incidents.fields.category')}>
            <select value={form.category} onChange={set('category')} className={selectClass}>
              <option value="">{t('common.none')}</option>
              {INCIDENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormField>

          <FormField label={t('incidents.fields.assignedTo')}>
            <select value={form.assignedTo} onChange={set('assignedTo')} className={selectClass}>
              <option value="">{t('common.none')}</option>
              {users.map(u => <option key={u.id} value={u.displayName}>{u.displayName}</option>)}
            </select>
          </FormField>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
            {t('common.cancel')}
          </button>
          <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
            <Save className="w-4 h-4" />
            {t('common.save')}
          </button>
        </div>
      </form>
    </div>
  )
}
