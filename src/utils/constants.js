// Incident statuses
export const INCIDENT_STATUS = {
  OPEN: 'abierta',
  IN_PROGRESS: 'en_progreso',
  RESOLVED: 'resuelta',
  CLOSED: 'cerrada',
}

// Incident priorities
export const INCIDENT_PRIORITY = {
  HIGH: 'alta',
  MEDIUM: 'media',
  LOW: 'baja',
}

// Incident categories
export const INCIDENT_CATEGORIES = [
  'Hardware',
  'Software',
  'Red',
  'Eléctrico',
  'Climatización',
  'Seguridad',
  'Infraestructura',
  'Comunicaciones',
  'Otro',
]

// Maintenance statuses
export const MAINTENANCE_STATUS = {
  PENDING: 'pendiente',
  IN_PROGRESS: 'en_progreso',
  COMPLETED: 'completado',
  OVERDUE: 'vencido',
}

// Maintenance frequencies
export const MAINTENANCE_FREQUENCY = {
  DAILY: 'diario',
  WEEKLY: 'semanal',
  MONTHLY: 'mensual',
  QUARTERLY: 'trimestral',
  ANNUAL: 'anual',
}

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'usuario',
}

// Notification types
export const NOTIFICATION_TYPE = {
  OVERDUE: 'overdue',
  STATUS_CHANGE: 'status_change',
  ASSIGNMENT: 'assignment',
}

// Priority colors (Tailwind classes)
export const PRIORITY_COLORS = {
  alta: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', dot: 'bg-red-500' },
  media: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', dot: 'bg-yellow-500' },
  baja: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', dot: 'bg-green-500' },
}

// Status colors (Tailwind classes)
export const INCIDENT_STATUS_COLORS = {
  abierta: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
  en_progreso: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400' },
  resuelta: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' },
  cerrada: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-400' },
}

export const MAINTENANCE_STATUS_COLORS = {
  pendiente: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
  en_progreso: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400' },
  completado: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' },
  vencido: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' },
}
