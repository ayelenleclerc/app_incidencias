import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Pencil, Trash2, ShieldCheck, User, X, Save, AlertCircle } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useAuth } from '../hooks/useAuth'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { FormField, inputClass, selectClass } from '../components/FormField'
import { USER_ROLES } from '../utils/constants'
import { formatDate } from '../utils/helpers'

const EMPTY_FORM = { username: '', displayName: '', password: '', role: USER_ROLES.USER }

export default function UserManagement() {
  const { t } = useTranslation()
  const users = useAuthStore((s) => s.users)
  const createUser = useAuthStore((s) => s.createUser)
  const updateUser = useAuthStore((s) => s.updateUser)
  const deleteUser = useAuthStore((s) => s.deleteUser)
  const { currentUser } = useAuth()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  const openCreate = () => {
    setEditingUser(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setErrorMsg('')
    setModalOpen(true)
  }

  const openEdit = (user) => {
    setEditingUser(user)
    setForm({ username: user.username, displayName: user.displayName, password: '', role: user.role })
    setErrors({})
    setErrorMsg('')
    setModalOpen(true)
  }

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((e) => ({ ...e, [field]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.displayName.trim()) errs.displayName = t('auth.errors.required')
    if (!editingUser && !form.username.trim()) errs.username = t('auth.errors.required')
    if (!editingUser && !form.password.trim()) errs.password = t('auth.errors.required')
    if (Object.keys(errs).length) { setErrors(errs); return }

    let result
    if (editingUser) {
      result = updateUser(editingUser.id, { displayName: form.displayName, role: form.role, password: form.password || undefined })
    } else {
      result = createUser({ username: form.username, password: form.password, displayName: form.displayName, role: form.role })
    }

    if (!result.success) {
      setErrorMsg(t(result.error))
      return
    }
    setModalOpen(false)
  }

  const handleDelete = (user) => {
    const result = deleteUser(user.id)
    if (!result.success) {
      setErrorMsg(t(result.error))
    }
    setConfirmDelete(null)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">{users.length} usuarios</p>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          {t('users.new')}
        </button>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {errorMsg}
          <button onClick={() => setErrorMsg('')} className="ml-auto"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Users grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(user => (
          <div key={user.id} className={`bg-white dark:bg-gray-800 rounded-xl border p-5 ${user.id === currentUser?.id ? 'border-blue-300 dark:border-blue-600' : 'border-gray-200 dark:border-gray-700'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${user.role === USER_ROLES.ADMIN ? 'bg-blue-600' : 'bg-gray-500'}`}>
                  {user.displayName?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{user.displayName}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">@{user.username}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(user)} className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded">
                  <Pencil className="w-4 h-4" />
                </button>
                {user.id !== currentUser?.id && (
                  <button onClick={() => setConfirmDelete(user)} className="p-1.5 text-gray-400 hover:text-red-500 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                user.role === USER_ROLES.ADMIN
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {user.role === USER_ROLES.ADMIN ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
                {t(`users.roles.${user.role}`)}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-600">{formatDate(user.createdAt)}</span>
            </div>
            {user.id === currentUser?.id && (
              <p className="text-xs text-blue-500 dark:text-blue-400 mt-2">(tú)</p>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 dark:text-white">
                {editingUser ? t('users.edit') : t('users.new')}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" /> {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label={t('users.fields.displayName')} required error={errors.displayName}>
                <input type="text" value={form.displayName} onChange={set('displayName')} className={inputClass} placeholder="Juan García" />
              </FormField>

              {!editingUser && (
                <FormField label={t('users.fields.username')} required error={errors.username}>
                  <input type="text" value={form.username} onChange={set('username')} className={inputClass} placeholder="jgarcia" />
                </FormField>
              )}

              <FormField
                label={editingUser ? t('users.fields.password') : t('auth.password')}
                required={!editingUser}
                error={errors.password}
                hint={editingUser ? 'Dejar en blanco para no cambiar' : undefined}
              >
                <input type="password" value={form.password} onChange={set('password')} className={inputClass} placeholder="••••••••" />
              </FormField>

              <FormField label={t('users.fields.role')}>
                <select value={form.role} onChange={set('role')} className={selectClass}>
                  {Object.values(USER_ROLES).map(r => (
                    <option key={r} value={r}>{t(`users.roles.${r}`)}</option>
                  ))}
                </select>
              </FormField>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                  {t('common.cancel')}
                </button>
                <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                  <Save className="w-4 h-4" />
                  {t('common.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        title={t('users.deleteConfirm')}
        description={t('users.deleteConfirmDesc')}
        onConfirm={() => handleDelete(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  )
}
