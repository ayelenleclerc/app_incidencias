import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AlertCircle, Wrench, TrendingUp, AlertTriangle, Plus, Clock } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { useIncidentsStore } from '../store/incidentsStore'
import { useMaintenanceStore } from '../store/maintenanceStore'
import { SummaryCard } from '../components/SummaryCard'
import { IncidentStatusBadge, MaintenanceStatusBadge, PriorityBadge } from '../components/StatusBadge'
import { formatDate, relativeTime } from '../utils/helpers'

const PRIORITY_CHART_COLORS = { alta: '#ef4444', media: '#f59e0b', baja: '#22c55e' }
const STATUS_CHART_COLORS = { pendiente: '#3b82f6', en_progreso: '#f97316', completado: '#22c55e', vencido: '#ef4444' }

export default function Dashboard() {
  const { t } = useTranslation()
  const incidents = useIncidentsStore((s) => s.incidents)
  const tasks = useMaintenanceStore((s) => s.tasks)

  const incidentStats = useMemo(() => {
    const total = incidents.length
    return {
      total,
      open: incidents.filter(i => i.status === 'abierta').length,
      inProgress: incidents.filter(i => i.status === 'en_progreso').length,
      resolved: incidents.filter(i => i.status === 'resuelta').length,
      closed: incidents.filter(i => i.status === 'cerrada').length,
    }
  }, [incidents])

  const maintenanceStats = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pendiente').length,
    inProgress: tasks.filter(t => t.status === 'en_progreso').length,
    completed: tasks.filter(t => t.status === 'completado').length,
    overdue: tasks.filter(t => t.status === 'vencido').length,
  }), [tasks])

  // Bar chart: incidents by priority
  const priorityData = useMemo(() => [
    { name: t('incidents.priority.alta'), value: incidents.filter(i => i.priority === 'alta').length, color: PRIORITY_CHART_COLORS.alta },
    { name: t('incidents.priority.media'), value: incidents.filter(i => i.priority === 'media').length, color: PRIORITY_CHART_COLORS.media },
    { name: t('incidents.priority.baja'), value: incidents.filter(i => i.priority === 'baja').length, color: PRIORITY_CHART_COLORS.baja },
  ], [incidents, t])

  // Pie chart: maintenance by status
  const maintenanceStatusData = useMemo(() => [
    { name: t('maintenance.status.pendiente'), value: maintenanceStats.pending, color: STATUS_CHART_COLORS.pendiente },
    { name: t('maintenance.status.en_progreso'), value: maintenanceStats.inProgress, color: STATUS_CHART_COLORS.en_progreso },
    { name: t('maintenance.status.completado'), value: maintenanceStats.completed, color: STATUS_CHART_COLORS.completado },
    { name: t('maintenance.status.vencido'), value: maintenanceStats.overdue, color: STATUS_CHART_COLORS.vencido },
  ].filter(d => d.value > 0), [maintenanceStats, t])

  // Recent activity (last 5 incidents + tasks combined, sorted by date)
  const recentActivity = useMemo(() => {
    const inc = incidents.slice(0, 10).map(i => ({ ...i, _type: 'incident' }))
    const tsk = tasks.slice(0, 10).map(t => ({ ...t, _type: 'maintenance' }))
    return [...inc, ...tsk]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 8)
  }, [incidents, tasks])

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title={t('dashboard.openIncidents')}
          value={incidentStats.open}
          icon={AlertCircle}
          color="blue"
          subtitle={`${incidentStats.inProgress} ${t('dashboard.inProgressIncidents').toLowerCase()}`}
        />
        <SummaryCard
          title={t('dashboard.totalIncidents')}
          value={incidentStats.total}
          icon={TrendingUp}
          color="purple"
        />
        <SummaryCard
          title={t('dashboard.pendingMaintenance')}
          value={maintenanceStats.pending}
          icon={Wrench}
          color="orange"
        />
        <SummaryCard
          title={t('dashboard.overdueMaintenance')}
          value={maintenanceStats.overdue}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Incidents by priority */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">{t('dashboard.incidentsByPriority')}</h3>
          {incidents.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-400 dark:text-gray-600 text-sm">
              {t('dashboard.noActivity')}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={priorityData} barSize={32}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {priorityData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Maintenance by status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">{t('dashboard.maintenanceByStatus')}</h3>
          {tasks.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-400 dark:text-gray-600 text-sm">
              {t('dashboard.noActivity')}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={maintenanceStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  dataKey="value"
                  paddingAngle={2}
                >
                  {maintenanceStatusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent activity + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent activity */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">{t('dashboard.recentActivity')}</h3>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-600">{t('dashboard.noActivity')}</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <Link
                  key={`${item._type}-${item.id}`}
                  to={`/${item._type === 'incident' ? 'incidents' : 'maintenance'}/${item.id}`}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                >
                  <div className={`mt-0.5 p-1.5 rounded-lg flex-shrink-0 ${item._type === 'incident' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-orange-50 dark:bg-orange-900/20'}`}>
                    {item._type === 'incident'
                      ? <AlertCircle className="w-3.5 h-3.5 text-blue-500" />
                      : <Wrench className="w-3.5 h-3.5 text-orange-500" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {item._type === 'incident' ? (
                        <>
                          <IncidentStatusBadge status={item.status} />
                          <PriorityBadge priority={item.priority} />
                        </>
                      ) : (
                        <MaintenanceStatusBadge status={item.status} />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-600 flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    {relativeTime(item.createdAt)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">Acciones rápidas</h3>
          <div className="space-y-3">
            <Link
              to="/incidents/new"
              className="flex items-center gap-3 w-full p-3 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors group"
            >
              <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {t('incidents.new')}
              </span>
            </Link>
            <Link
              to="/maintenance/new"
              className="flex items-center gap-3 w-full p-3 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 hover:bg-orange-50/50 dark:hover:bg-orange-900/10 transition-colors group"
            >
              <div className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <Plus className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                {t('maintenance.new')}
              </span>
            </Link>
          </div>

          {/* Stats summary */}
          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">{t('incidents.status.resuelta')}</span>
              <span className="font-medium text-gray-900 dark:text-white">{incidentStats.resolved}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">{t('maintenance.status.completado')}</span>
              <span className="font-medium text-gray-900 dark:text-white">{maintenanceStats.completed}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">{t('common.total')} items</span>
              <span className="font-medium text-gray-900 dark:text-white">{incidentStats.total + maintenanceStats.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
