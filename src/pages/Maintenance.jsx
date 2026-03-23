import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus, SlidersHorizontal, Download, Eye, Pencil, Trash2, CheckSquare, ChevronDown, ChevronUp, Clock } from 'lucide-react'
import { useMaintenanceStore } from '../store/maintenanceStore'
import { useAuthStore } from '../store/authStore'
import { MaintenanceStatusBadge } from '../components/StatusBadge'
import { SearchInput } from '../components/SearchInput'
import { EmptyState } from '../components/EmptyState'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { MAINTENANCE_STATUS, MAINTENANCE_FREQUENCY } from '../utils/constants'
import { filterMaintenance, formatDate, sortBy, daysUntil } from '../utils/helpers'
import { exportToCSV, exportToPDF } from '../utils/export'
import { selectClass } from '../components/FormField'

const EMPTY_FILTERS = { status: '', frequency: '', responsible: '', area: '' }

export default function Maintenance() {
  const { t } = useTranslation()
  const tasks = useMaintenanceStore((s) => s.tasks)
  const remove = useMaintenanceStore((s) => s.remove)
  const complete = useMaintenanceStore((s) => s.complete)
  const users = useAuthStore((s) => s.users)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [sort, setSort] = useState({ field: 'nextDueDate', dir: 'asc' })

  const filtered = useMemo(() => {
    const result = filterMaintenance(tasks, filters, search)
    return sortBy(result, sort.field, sort.dir)
  }, [tasks, filters, search, sort])

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  const toggleSort = (field) => {
    setSort((s) => s.field === field ? { field, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { field, dir: 'asc' })
  }

  const SortIcon = ({ field }) => {
    if (sort.field !== field) return null
    return sort.dir === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
  }

  const DueBadge = ({ task }) => {
    if (task.status === MAINTENANCE_STATUS.COMPLETED) return null
    const days = daysUntil(task.nextDueDate)
    if (days === null) return null
    if (days < 0) return <span className="text-xs text-red-500 font-medium">{t('maintenance.daysOverdue', { days: Math.abs(days) })}</span>
    if (days === 0) return <span className="text-xs text-orange-500 font-medium">{t('maintenance.dueToday')}</span>
    if (days <= 7) return <span className="text-xs text-yellow-500 font-medium">{t('maintenance.daysUntil', { days })}</span>
    return <span className="text-xs text-gray-400">{formatDate(task.nextDueDate)}</span>
  }

  const handleExportCSV = () => {
    exportToCSV(filtered.map(task => ({
      Título: task.title,
      Estado: t(`maintenance.status.${task.status}`),
      Frecuencia: t(`maintenance.frequency.${task.frequency}`),
      Responsable: task.responsible,
      'Próxima fecha': formatDate(task.nextDueDate),
      'Última realización': formatDate(task.lastCompletedDate),
      Equipo: task.equipment,
      Área: task.area,
    })), 'mantenimientos')
  }

  const handleExportPDF = () => {
    exportToPDF(
      filtered,
      ['title', 'status', 'frequency', 'responsible', 'nextDueDate'],
      [t('maintenance.fields.title'), t('maintenance.fields.status'), t('maintenance.fields.frequency'), t('maintenance.fields.responsible'), t('maintenance.fields.nextDueDate')],
      t('maintenance.title'),
      (field, value) => {
        if (field === 'status') return t(`maintenance.status.${value}`)
        if (field === 'frequency') return t(`maintenance.frequency.${value}`)
        if (field === 'nextDueDate') return formatDate(value)
        return value || '-'
      }
    )
  }

  // Unique areas from data
  const areas = [...new Set(tasks.map(t => t.area).filter(Boolean))]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {filtered.length} mantenimiento{filtered.length !== 1 ? 's' : ''}
        </p>
        <Link to="/maintenance/new" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          {t('maintenance.new')}
        </Link>
      </div>

      {/* Search + Filters */}
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
              <span className="bg-blue-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">{activeFilterCount}</span>
            )}
          </button>
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Download className="w-4 h-4" />
            </button>
            <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 hidden group-hover:block">
              <button onClick={handleExportCSV} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg">{t('common.exportCSV')}</button>
              <button onClick={handleExportPDF} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-lg">{t('common.exportPDF')}</button>
            </div>
          </div>
        </div>

        {filtersOpen && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))} className={selectClass}>
              <option value="">{t('common.all')} estado</option>
              {Object.values(MAINTENANCE_STATUS).map(s => <option key={s} value={s}>{t(`maintenance.status.${s}`)}</option>)}
            </select>
            <select value={filters.frequency} onChange={e => setFilters(f => ({ ...f, frequency: e.target.value }))} className={selectClass}>
              <option value="">{t('common.all')} frecuencia</option>
              {Object.values(MAINTENANCE_FREQUENCY).map(fr => <option key={fr} value={fr}>{t(`maintenance.frequency.${fr}`)}</option>)}
            </select>
            <select value={filters.responsible} onChange={e => setFilters(f => ({ ...f, responsible: e.target.value }))} className={selectClass}>
              <option value="">{t('common.all')} responsable</option>
              {users.map(u => <option key={u.id} value={u.displayName}>{u.displayName}</option>)}
            </select>
            <div className="flex gap-2">
              <select value={filters.area} onChange={e => setFilters(f => ({ ...f, area: e.target.value }))} className={`${selectClass} flex-1`}>
                <option value="">{t('common.all')} área</option>
                {areas.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              {activeFilterCount > 0 && (
                <button onClick={() => setFilters(EMPTY_FILTERS)} className="px-2 py-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">✕</button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title={tasks.length === 0 ? t('maintenance.noMaintenance') : t('common.noResults')}
          description={tasks.length === 0 ? t('maintenance.noMaintenanceDesc') : t('common.noResultsDesc')}
          action={tasks.length === 0 && (
            <Link to="/maintenance/new" className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
              {t('maintenance.new')}
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
                    { field: 'title', label: t('maintenance.fields.title') },
                    { field: 'status', label: t('maintenance.fields.status') },
                    { field: 'frequency', label: t('maintenance.fields.frequency') },
                    { field: 'responsible', label: t('maintenance.fields.responsible') },
                    { field: 'nextDueDate', label: t('maintenance.fields.nextDueDate') },
                    { field: 'area', label: t('maintenance.fields.area') },
                  ].map(col => (
                    <th key={col.field} onClick={() => toggleSort(col.field)} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 select-none">
                      <span className="flex items-center gap-1">{col.label}<SortIcon field={col.field} /></span>
                    </th>
                  ))}
                  <th className="px-4 py-3 w-28"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.map(task => (
                  <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <Link to={`/maintenance/${task.id}`} className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 line-clamp-1">{task.title}</Link>
                      {task.equipment && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{task.equipment}</p>}
                    </td>
                    <td className="px-4 py-3"><MaintenanceStatusBadge status={task.status} /></td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{t(`maintenance.frequency.${task.frequency}`)}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{task.responsible || '-'}</td>
                    <td className="px-4 py-3"><DueBadge task={task} /></td>
                    <td className="px-4 py-3 text-gray-400 dark:text-gray-500 text-xs">{task.area || '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {task.status !== MAINTENANCE_STATUS.COMPLETED && (
                          <button onClick={() => complete(task.id)} className="p-1.5 text-gray-400 hover:text-green-600 dark:hover:text-green-400 rounded" title={t('maintenance.complete')}>
                            <CheckSquare className="w-4 h-4" />
                          </button>
                        )}
                        <Link to={`/maintenance/${task.id}`} className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded"><Eye className="w-4 h-4" /></Link>
                        <Link to={`/maintenance/${task.id}/edit`} className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded"><Pencil className="w-4 h-4" /></Link>
                        <button onClick={() => setConfirmDelete(task)} className="p-1.5 text-gray-400 hover:text-red-500 rounded"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map(task => (
              <div key={task.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <Link to={`/maintenance/${task.id}`} className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 leading-snug block">{task.title}</Link>
                    {task.equipment && <p className="text-xs text-gray-400">{task.equipment}</p>}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    {task.status !== MAINTENANCE_STATUS.COMPLETED && (
                      <button onClick={() => complete(task.id)} className="p-1.5 text-gray-400 hover:text-green-600"><CheckSquare className="w-4 h-4" /></button>
                    )}
                    <Link to={`/maintenance/${task.id}/edit`} className="p-1.5 text-gray-400 hover:text-gray-700"><Pencil className="w-4 h-4" /></Link>
                    <button onClick={() => setConfirmDelete(task)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <MaintenanceStatusBadge status={task.status} />
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">{t(`maintenance.frequency.${task.frequency}`)}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  <DueBadge task={task} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        title={t('maintenance.deleteConfirm')}
        description={t('maintenance.deleteConfirmDesc')}
        onConfirm={() => { remove(confirmDelete.id); setConfirmDelete(null) }}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  )
}
