import { MAINTENANCE_STATUS } from './constants'

// Generate a simple unique ID
export function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36)
}

// Format date to readable string
export function formatDate(isoString, options = {}) {
  if (!isoString) return '-'
  const date = new Date(isoString)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...options,
  })
}

// Format datetime
export function formatDateTime(isoString) {
  if (!isoString) return '-'
  const date = new Date(isoString)
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Get relative time string (e.g., "hace 2 horas")
export function relativeTime(isoString) {
  if (!isoString) return ''
  const diff = Date.now() - new Date(isoString).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'ahora'
  if (minutes < 60) return `hace ${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `hace ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `hace ${days}d`
  return formatDate(isoString)
}

// Check if a date is past due
export function isOverdue(dateString) {
  if (!dateString) return false
  return new Date(dateString) < new Date()
}

// Days until due (negative if overdue)
export function daysUntil(dateString) {
  if (!dateString) return null
  const diff = new Date(dateString).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)
  return Math.round(diff / 86400000)
}

// Simple text search across object fields
export function matchesSearch(item, searchTerm, fields) {
  if (!searchTerm) return true
  const lower = searchTerm.toLowerCase()
  return fields.some(field => {
    const value = item[field]
    return value && String(value).toLowerCase().includes(lower)
  })
}

// Filter incidents by filter object
export function filterIncidents(incidents, filters, searchTerm) {
  return incidents.filter(inc => {
    if (filters.status && inc.status !== filters.status) return false
    if (filters.priority && inc.priority !== filters.priority) return false
    if (filters.category && inc.category !== filters.category) return false
    if (filters.assignedTo && inc.assignedTo !== filters.assignedTo) return false
    if (filters.dateFrom && new Date(inc.createdAt) < new Date(filters.dateFrom)) return false
    if (filters.dateTo && new Date(inc.createdAt) > new Date(filters.dateTo + 'T23:59:59')) return false
    if (!matchesSearch(inc, searchTerm, ['title', 'description', 'assignedTo', 'category'])) return false
    return true
  })
}

// Filter maintenance tasks
export function filterMaintenance(tasks, filters, searchTerm) {
  return tasks.filter(task => {
    if (filters.status && task.status !== filters.status) return false
    if (filters.frequency && task.frequency !== filters.frequency) return false
    if (filters.responsible && task.responsible !== filters.responsible) return false
    if (filters.area && task.area !== filters.area) return false
    if (!matchesSearch(task, searchTerm, ['title', 'description', 'responsible', 'equipment', 'area'])) return false
    return true
  })
}

// Calculate next due date based on frequency
export function calcNextDueDate(lastDate, frequency) {
  const date = lastDate ? new Date(lastDate) : new Date()
  switch (frequency) {
    case 'diario': date.setDate(date.getDate() + 1); break
    case 'semanal': date.setDate(date.getDate() + 7); break
    case 'mensual': date.setMonth(date.getMonth() + 1); break
    case 'trimestral': date.setMonth(date.getMonth() + 3); break
    case 'anual': date.setFullYear(date.getFullYear() + 1); break
    default: date.setMonth(date.getMonth() + 1)
  }
  return date.toISOString().split('T')[0]
}

// Simple password hash (not secure, just for local use)
export function hashPassword(password) {
  return btoa(encodeURIComponent(password + ':salt_gestinn'))
}

// Verify password
export function verifyPassword(password, hash) {
  return hashPassword(password) === hash
}

// Determine maintenance status based on dates
export function computeMaintenanceStatus(task) {
  if (task.status === MAINTENANCE_STATUS.COMPLETED) return MAINTENANCE_STATUS.COMPLETED
  if (task.status === MAINTENANCE_STATUS.IN_PROGRESS) return MAINTENANCE_STATUS.IN_PROGRESS
  if (task.nextDueDate && isOverdue(task.nextDueDate)) return MAINTENANCE_STATUS.OVERDUE
  return MAINTENANCE_STATUS.PENDING
}

// Truncate text
export function truncate(text, length = 60) {
  if (!text) return ''
  return text.length > length ? text.slice(0, length) + '...' : text
}

// Sort array by field
export function sortBy(arr, field, dir = 'asc') {
  return [...arr].sort((a, b) => {
    const av = a[field] ?? ''
    const bv = b[field] ?? ''
    const cmp = av < bv ? -1 : av > bv ? 1 : 0
    return dir === 'asc' ? cmp : -cmp
  })
}
