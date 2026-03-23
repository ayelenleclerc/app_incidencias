import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus, SlidersHorizontal, Download, Eye, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useIncidentsStore } from '../store/incidentsStore'
import { useAuthStore } from '../store/authStore'
import { IncidentStatusBadge, PriorityBadge } from '../components/StatusBadge'
import { SearchInput } from '../components/SearchInput'
import { EmptyState } from '../components/EmptyState'
import { ConfirmDialog } from '../components/ConfirmDialog'
import {
  INCIDENT_STATUS, INCIDENT_PRIORITY, INCIDENT_CATEGORIES,
} from '../utils/constants'
import { filterIncidents, formatDate, sortBy } from '../utils/helpers'
import { exportToCSV, exportToPDF } from '../utils/export'
import { selectClass } from '../components/FormField'

const EMPTY_FILTERS = { status: '', priority: '', category: '', assignedTo: '', dateFrom: '', dateTo: '' }

export default function Incidents() {
  const { t } = useTranslation()
  const incidents = useIncidentsStore((s) => s.incidents)
  const remove = useIncidentsStore((s) => s.remove)
  const users = useAuthStore((s) => s.users)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [sort, setSort] = useState({ field: 'createdAt', dir: 'desc' })

  const filtered = useMemo(() => {
    const result = filterIncidents(incidents, filters, search)
    return sortBy(result, sort.field, sort.dir)
  }, [incidents, filters, search, sort])

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  const toggleSort = (field) => {
    setSort((s) => s.field === field ? { field, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { field, dir: 'desc' })
  }

  const SortIcon = ({ field }) => {
    if (sort.field !== field) return null
    return sort.dir === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
  }

  const handleExportCSV = () => {
    exportToCSV(filtered.map(i => ({
      Título: i.title,
      Estado: t(`incidents.status.${i.status}`),
      Prioridad: t(`incidents.priority.${i.priority}`),
      Categoría: i.category,
      'Asignado a': i.assignedTo,
      'Creado por': i.createdBy,
      'Fecha creación': formatDate(i.createdAt),
      'Fecha resolución': formatDate(i.resolvedAt),
    })), 'incidencias')
  }

  const handleExportPDF = () => {
    exportToPDF(
      filtered,
      ['title', 'status', 'priority', 'assignedTo', 'createdAt'],
      [t('incidents.fields.title'), t('incidents.fields.status'), t('incidents.fields.priority'), t('incidents.fields.assignedTo'), t('incidents.fields.createdAt')],
      t('incidents.title'),
      (field, value) => {
        if (field === 'status') return t(`incidents.status.${value}`)
        if (field === 'priority') return t(`incidents.priority.${value}`)
        if (field === 'createdAt') return formatDate(value)
        return value || '-'
      }
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {filtered.length} {filtered.length === 1 ? 'incidencia' : 'incidencias'}
        </p>
        <Link
          to="/incidents/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('incidents.new')}
        </Link>
      </div>

      {/* Search + Filter toolbar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
        <div className="flex gap-2">
          <div className="flex-1">
            <SearchInput value={search} onChange={setSearch} />
          </div>
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
              activeFilterCount > 0
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {t('common.filter')}
            {activeFilterCount > 0 && (
              <span className="bg-blue-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Download className="w-4 h-4" />
            </button>
            <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 hidden group-hover:block">
              <button onClick={handleExportCSV} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg">
                {t('common.exportCSV')}
              </button>
              <button onClick={handleExportPDF} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-lg">
                {t('common.exportPDF')}
              </button>
            </div>
          </div>
        </div>

        {/* Filters panel */}
        {filtersOpen && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))} className={selectClass}>
              <option value="">{t('common.all')} estado</option>
              {Object.values(INCIDENT_STATUS).map(s => (
                <option key={s} value={s}>{t(`incidents.status.${s}`)}</option>
              ))}
            </select>
            <select value={filters.priority} onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))} className={selectClass}>
              <option value="">{t('common.all')} prioridad</option>
              {Object.values(INCIDENT_PRIORITY).map(p => (
                <option key={p} value={p}>{t(`incidents.priority.${p}`)}</option>
              ))}
            </select>
            <select value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))} className={selectClass}>
              <option value="">{t('common.all')} categoría</option>
              {INCIDENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filters.assignedTo} onChange={e => setFilters(f => ({ ...f, assignedTo: e.target.value }))} className={selectClass}>
              <option value="">{t('common.all')} asignado</option>
              {users.map(u => <option key={u.id} value={u.displayName}>{u.displayName}</option>)}
            </select>
            <input type="date" value={filters.dateFrom} onChange={e => setFilters(f => ({ ...f, dateFrom: e.target.value }))}
              className={selectClass} placeholder={t('common.from')} />
            <div className="flex gap-2">
              <input type="date" value={filters.dateTo} onChange={e => setFilters(f => ({ ...f, dateTo: e.target.value }))}
                className={`${selectClass} flex-1`} placeholder={t('common.to')} />
              {activeFilterCount > 0 && (
                <button onClick={() => setFilters(EMPTY_FILTERS)} className="px-2 py-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                  ✕
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title={incidents.length === 0 ? t('incidents.noIncidents') : t('common.noResults')}
          description={incidents.length === 0 ? t('incidents.noIncidentsDesc') : t('common.noResultsDesc')}
          action={incidents.length === 0 && (
            <Link to="/incidents/new" className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
              {t('incidents.new')}
            </Link>
          )}
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                  {[
                    { field: 'title', label: t('incidents.fields.title') },
                    { field: 'status', label: t('incidents.fields.status') },
                    { field: 'priority', label: t('incidents.fields.priority') },
                    { field: 'category', label: t('incidents.fields.category') },
                    { field: 'assignedTo', label: t('incidents.fields.assignedTo') },
                    { field: 'createdAt', label: t('incidents.fields.createdAt') },
                  ].map(col => (
                    <th
                      key={col.field}
                      onClick={() => toggleSort(col.field)}
                      className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 select-none"
                    >
                      <span className="flex items-center gap-1">
                        {col.label}
                        <SortIcon field={col.field} />
                      </span>
                    </th>
                  ))}
                  <th className="px-4 py-3 w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.map(inc => (
                  <tr key={inc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <Link to={`/incidents/${inc.id}`} className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 line-clamp-1">
                        {inc.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3"><IncidentStatusBadge status={inc.status} /></td>
                    <td className="px-4 py-3"><PriorityBadge priority={inc.priority} /></td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{inc.category || '-'}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{inc.assignedTo || '-'}</td>
                    <td className="px-4 py-3 text-gray-400 dark:text-gray-500 text-xs">{formatDate(inc.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link to={`/incidents/${inc.id}`} className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link to={`/incidents/${inc.id}/edit`} className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded">
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button onClick={() => setConfirmDelete(inc)} className="p-1.5 text-gray-400 hover:text-red-500 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map(inc => (
              <div key={inc.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Link to={`/incidents/${inc.id}`} className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 leading-snug">
                    {inc.title}
                  </Link>
                  <div className="flex gap-1 flex-shrink-0">
                    <Link to={`/incidents/${inc.id}/edit`} className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button onClick={() => setConfirmDelete(inc)} className="p-1.5 text-gray-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <IncidentStatusBadge status={inc.status} />
                  <PriorityBadge priority={inc.priority} />
                  {inc.category && <span className="text-xs text-gray-400">{inc.category}</span>}
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{formatDate(inc.createdAt)}</p>
              </div>
            ))}
          </div>
        </>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        title={t('incidents.deleteConfirm')}
        description={t('incidents.deleteConfirmDesc')}
        onConfirm={() => { remove(confirmDelete.id); setConfirmDelete(null) }}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  )
}
