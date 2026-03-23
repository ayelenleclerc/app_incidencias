import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, X } from 'lucide-react'

export function SearchInput({ value, onChange, placeholder }) {
  const { t } = useTranslation()
  const [local, setLocal] = useState(value || '')

  useEffect(() => {
    const timer = setTimeout(() => onChange(local), 300)
    return () => clearTimeout(timer)
  }, [local])

  useEffect(() => {
    setLocal(value || '')
  }, [value])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder || t('common.search')}
        className="w-full pl-9 pr-8 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
      />
      {local && (
        <button
          onClick={() => setLocal('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
