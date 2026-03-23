import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateId, calcNextDueDate, isOverdue } from '../utils/helpers'
import { MAINTENANCE_STATUS } from '../utils/constants'

export const useMaintenanceStore = create(
  persist(
    (set, get) => ({
      tasks: [],

      add: (data, createdBy) => {
        const task = {
          id: generateId(),
          title: data.title,
          description: data.description || '',
          frequency: data.frequency || 'mensual',
          responsible: data.responsible || '',
          nextDueDate: data.nextDueDate || '',
          lastCompletedDate: null,
          status: MAINTENANCE_STATUS.PENDING,
          equipment: data.equipment || '',
          area: data.area || '',
          createdBy: createdBy || '',
          createdAt: new Date().toISOString(),
          _lastNotifiedOverdue: null,
        }
        set((state) => ({ tasks: [task, ...state.tasks] }))
        return task
      },

      update: (id, data) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...data } : t
          ),
        }))
      },

      remove: (id) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

      // Mark as completed and calculate next due date
      complete: (id) => {
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== id) return t
            const today = new Date().toISOString().split('T')[0]
            return {
              ...t,
              status: MAINTENANCE_STATUS.COMPLETED,
              lastCompletedDate: today,
              nextDueDate: calcNextDueDate(today, t.frequency),
              _lastNotifiedOverdue: null,
            }
          }),
        }))
      },

      // Check and update overdue statuses, returns list of newly overdue task ids
      checkOverdue: () => {
        const tasks = get().tasks
        const newlyOverdue = []
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (
              t.status !== MAINTENANCE_STATUS.COMPLETED &&
              t.status !== MAINTENANCE_STATUS.IN_PROGRESS &&
              t.nextDueDate &&
              isOverdue(t.nextDueDate) &&
              t.status !== MAINTENANCE_STATUS.OVERDUE
            ) {
              newlyOverdue.push(t)
              return { ...t, status: MAINTENANCE_STATUS.OVERDUE }
            }
            return t
          }),
        }))
        return newlyOverdue
      },

      getById: (id) => get().tasks.find((t) => t.id === id),

      getStats: () => {
        const tasks = get().tasks
        return {
          total: tasks.length,
          pending: tasks.filter((t) => t.status === MAINTENANCE_STATUS.PENDING).length,
          inProgress: tasks.filter((t) => t.status === MAINTENANCE_STATUS.IN_PROGRESS).length,
          completed: tasks.filter((t) => t.status === MAINTENANCE_STATUS.COMPLETED).length,
          overdue: tasks.filter((t) => t.status === MAINTENANCE_STATUS.OVERDUE).length,
        }
      },
    }),
    { name: 'maintenance-storage' }
  )
)
