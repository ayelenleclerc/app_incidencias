import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateId } from '../utils/helpers'
import { INCIDENT_STATUS, INCIDENT_PRIORITY } from '../utils/constants'

export const useIncidentsStore = create(
  persist(
    (set, get) => ({
      incidents: [],

      add: (data, createdBy) => {
        const incident = {
          id: generateId(),
          title: data.title,
          description: data.description || '',
          priority: data.priority || INCIDENT_PRIORITY.MEDIUM,
          status: INCIDENT_STATUS.OPEN,
          category: data.category || '',
          assignedTo: data.assignedTo || '',
          createdBy: createdBy || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          resolvedAt: null,
          notes: [],
        }
        set((state) => ({ incidents: [incident, ...state.incidents] }))
        return incident
      },

      update: (id, data) => {
        set((state) => ({
          incidents: state.incidents.map((inc) => {
            if (inc.id !== id) return inc
            const updated = { ...inc, ...data, updatedAt: new Date().toISOString() }
            // Set resolvedAt when resolving
            if (data.status === INCIDENT_STATUS.RESOLVED && !inc.resolvedAt) {
              updated.resolvedAt = new Date().toISOString()
            }
            // Clear resolvedAt when reopening
            if (data.status === INCIDENT_STATUS.OPEN) {
              updated.resolvedAt = null
            }
            return updated
          }),
        }))
      },

      remove: (id) =>
        set((state) => ({ incidents: state.incidents.filter((i) => i.id !== id) })),

      addNote: (incidentId, text, author) => {
        const note = {
          id: generateId(),
          text,
          author: author || '',
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          incidents: state.incidents.map((inc) =>
            inc.id === incidentId
              ? { ...inc, notes: [...inc.notes, note], updatedAt: new Date().toISOString() }
              : inc
          ),
        }))
      },

      getById: (id) => get().incidents.find((i) => i.id === id),

      // Stats for dashboard
      getStats: () => {
        const incidents = get().incidents
        return {
          total: incidents.length,
          open: incidents.filter((i) => i.status === INCIDENT_STATUS.OPEN).length,
          inProgress: incidents.filter((i) => i.status === INCIDENT_STATUS.IN_PROGRESS).length,
          resolved: incidents.filter((i) => i.status === INCIDENT_STATUS.RESOLVED).length,
          closed: incidents.filter((i) => i.status === INCIDENT_STATUS.CLOSED).length,
          highPriority: incidents.filter((i) => i.priority === INCIDENT_PRIORITY.HIGH).length,
        }
      },
    }),
    { name: 'incidents-storage' }
  )
)
