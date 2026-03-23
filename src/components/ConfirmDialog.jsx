import { useTranslation } from 'react-i18next'
import { AlertTriangle } from 'lucide-react'

export function ConfirmDialog({ open, title, description, onConfirm, onCancel, danger = true }) {
  const { t } = useTranslation()
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-full flex-shrink-0 ${danger ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
            <AlertTriangle className={`w-5 h-5 ${danger ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
            {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
              danger ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {t('common.confirm')}
          </button>
        </div>
      </div>
    </div>
  )
}
