import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { inputClass } from '../components/FormField'

export default function Register() {
  const { t } = useTranslation()
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', displayName: '', password: '', confirmPassword: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!form.username || !form.password || !form.displayName) {
      setError(t('auth.errors.required'))
      return
    }
    if (form.password.length < 6) {
      setError(t('auth.errors.minLength', { min: 6 }))
      return
    }
    if (form.password !== form.confirmPassword) {
      setError(t('auth.errors.passwordMismatch'))
      return
    }

    setLoading(true)
    setTimeout(() => {
      const result = register({ username: form.username, password: form.password, displayName: form.displayName })
      if (result.success) {
        navigate('/')
      } else {
        setError(t(result.error))
      }
      setLoading(false)
    }, 300)
  }

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('auth.registerTitle')}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('auth.registerSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('auth.displayName')}</label>
              <input type="text" value={form.displayName} onChange={set('displayName')} className={inputClass} placeholder="Juan García" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('auth.username')}</label>
              <input type="text" value={form.username} onChange={set('username')} className={inputClass} placeholder="jgarcia" autoComplete="username" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('auth.password')}</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  className={`${inputClass} pr-10`}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('auth.confirmPassword')}</label>
              <input type="password" value={form.confirmPassword} onChange={set('confirmPassword')} className={inputClass} placeholder="••••••••" autoComplete="new-password" />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium rounded-lg transition-colors text-sm">
              {loading ? t('common.loading') : t('auth.register')}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            {t('auth.hasAccount')}{' '}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              {t('auth.login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
