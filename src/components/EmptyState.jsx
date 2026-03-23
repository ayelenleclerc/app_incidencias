import { useTranslation } from 'react-i18next'
import { PackageOpen } from 'lucide-react'

export function EmptyState({ title, description, action }) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <PackageOpen className="w-8 h-8 text-gray-400 dark:text-gray-600" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
        {title || t('common.noResults')}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-xs">
        {description || t('common.noResultsDesc')}
      </p>
      {action}
    </div>
  )
}
