import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Save } from 'lucide-react'
import { useMaintenanceStore } from '../store/maintenanceStore'
import { useAuth } from '../hooks/useAuth'
import { useAuthStore } from '../store/authStore'
import { FormField, inputClass, selectClass, textareaClass } from '../components/FormField'
import { MAINTENANCE_FREQUENCY, MAINTENANCE_STATUS } from '../utils/constants'

export default function MaintenanceForm() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const { currentUser } = useAuth()
  const users = useAuthStore((s) => s.users)
  const addTask = useMaintenanceStore((s) => s.add)
  const updateTask = useMaintenanceStore((s) => s.update)
  const getById = useMaintenanceStore((s) => s.getById)

  const [form, setForm] = useState({
    title: '', description: '', frequency: 'mensual',
    responsible: '', nextDueDate: '', equipment: '', area: '',
    status: MAINTENANCE_STATUS.PENDING,
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isEdit) {
      const task = getById(id)
      if (!task) { navigate('/maintenance'); return }
      setForm({
        title: task.title,
        description: task.description,
        frequency: task.frequency,
        responsible: task.responsible,
        nextDueDate: task.nextDueDate || '',
        equipment: task.equipment,
        area: task.area,
        status: task.status,
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
      updateTask(id, form)
    } else {
      addTask(form, currentUser?.displayName)
    }
    navigate('/maintenance')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {isEdit ? t('maintenance.edit') : t('maintenance.new')}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
        <FormField label={t('maintenance.fields.title')} required error={errors.title}>
          <input type="text" value={form.title} onChange={set('title')} className={inputClass} placeholder="Ej: Revisión sistema de climatización" />
        </FormField>

        <FormField label={t('maintenance.fields.description')}>
          <textarea value={form.description} onChange={set('description')} className={textareaClass} rows={3} placeholder="Describe el mantenimiento a realizar..." />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label={t('maintenance.fields.frequency')} required>
            <select value={form.frequency} onChange={set('frequency')} className={selectClass}>
              {Object.values(MAINTENANCE_FREQUENCY).map(f => (
                <option key={f} value={f}>{t(`maintenance.frequency.${f}`)}</option>
              ))}
            </select>
          </FormField>

          <FormField label={t('maintenance.fields.responsible')}>
            <select value={form.responsible} onChange={set('responsible')} className={selectClass}>
              <option value="">{t('common.none')}</option>
              {users.map(u => <option key={u.id} value={u.displayName}>{u.displayName}</option>)}
            </select>
          </FormField>

          <FormField label={t('maintenance.fields.nextDueDate')}>
            <input type="date" value={form.nextDueDate} onChange={set('nextDueDate')} className={inputClass} />
          </FormField>

          {isEdit && (
            <FormField label={t('maintenance.fields.status')}>
              <select value={form.status} onChange={set('status')} className={selectClass}>
                {Object.values(MAINTENANCE_STATUS).map(s => (
                  <option key={s} value={s}>{t(`maintenance.status.${s}`)}</option>
                ))}
              </select>
            </FormField>
          )}

          <FormField label={t('maintenance.fields.equipment')}>
            <input type="text" value={form.equipment} onChange={set('equipment')} className={inputClass} placeholder="Ej: HVAC-01, Compresor norte" />
          </FormField>

          <FormField label={t('maintenance.fields.area')}>
            <input type="text" value={form.area} onChange={set('area')} className={inputClass} placeholder="Ej: Sala de máquinas, Planta 2" />
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
