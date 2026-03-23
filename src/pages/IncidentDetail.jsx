import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Pencil, Trash2, MessageSquarePlus, CheckCircle, XCircle, RotateCcw, User, Calendar, Tag, Folder } from 'lucide-react'
import { useIncidentsStore } from '../store/incidentsStore'
import { useAuth } from '../hooks/useAuth'
import { IncidentStatusBadge, PriorityBadge } from '../components/StatusBadge'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { textareaClass } from '../components/FormField'
import { formatDateTime, formatDate } from '../utils/helpers'
import { INCIDENT_STATUS } from '../utils/constants'

export default function IncidentDetail() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const incident = useIncidentsStore((s) => s.getById(id))
  const update = useIncidentsStore((s) => s.update)
  const remove = useIncidentsStore((s) => s.remove)
  const addNote = useIncidentsStore((s) => s.addNote)
  const [noteText, setNoteText] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!incident) return (
    <div className="text-center py-16 text-gray-400 dark:text-gray-600">
      <p>Incidencia no encontrada.</p>
      <Link to="/incidents" className="text-blue-600 dark:text-blue-400 hover:underline text-sm mt-2 inline-block">Volver a incidencias</Link>
    </div>
  )

  const handleAddNote = () => {
    if (!noteText.trim()) return
    addNote(id, noteText.trim(), currentUser?.displayName)
    setNoteText('')
  }

  const handleStatusChange = (status) => update(id, { status })

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3">
      <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 flex-shrink-0">
        <Icon className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
      </div>
      <div>
        <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
        <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{value || '-'}</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        <div className="flex gap-2">
          <Link to={`/incidents/${id}/edit`} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Pencil className="w-4 h-4" />
            {t('common.edit')}
          </Link>
          <button onClick={() => setConfirmDelete(true)} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <IncidentStatusBadge status={incident.status} />
          <PriorityBadge priority={incident.priority} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{incident.title}</h2>
        {incident.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap mb-5">{incident.description}</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <InfoRow icon={User} label={t('incidents.fields.assignedTo')} value={incident.assignedTo} />
          <InfoRow icon={User} label={t('incidents.fields.createdBy')} value={incident.createdBy} />
          <InfoRow icon={Folder} label={t('incidents.fields.category')} value={incident.category} />
          <InfoRow icon={Calendar} label={t('incidents.fields.createdAt')} value={formatDate(incident.createdAt)} />
          {incident.resolvedAt && (
            <InfoRow icon={CheckCircle} label={t('incidents.fields.resolvedAt')} value={formatDate(incident.resolvedAt)} />
          )}
        </div>

        {/* Status actions */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
          {incident.status !== INCIDENT_STATUS.IN_PROGRESS && incident.status !== INCIDENT_STATUS.RESOLVED && incident.status !== INCIDENT_STATUS.CLOSED && (
            <button onClick={() => handleStatusChange(INCIDENT_STATUS.IN_PROGRESS)} className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30">
              Iniciar progreso
            </button>
          )}
          {incident.status !== INCIDENT_STATUS.RESOLVED && incident.status !== INCIDENT_STATUS.CLOSED && (
            <button onClick={() => handleStatusChange(INCIDENT_STATUS.RESOLVED)} className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30">
              <CheckCircle className="w-3.5 h-3.5" />
              {t('incidents.resolve')}
            </button>
          )}
          {incident.status !== INCIDENT_STATUS.CLOSED && incident.status !== INCIDENT_STATUS.OPEN && (
            <button onClick={() => handleStatusChange(INCIDENT_STATUS.CLOSED)} className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
              <XCircle className="w-3.5 h-3.5" />
              {t('incidents.close')}
            </button>
          )}
          {(incident.status === INCIDENT_STATUS.RESOLVED || incident.status === INCIDENT_STATUS.CLOSED) && (
            <button onClick={() => handleStatusChange(INCIDENT_STATUS.OPEN)} className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30">
              <RotateCcw className="w-3.5 h-3.5" />
              {t('incidents.reopen')}
            </button>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-4 flex items-center gap-2">
          <MessageSquarePlus className="w-4 h-4 text-blue-500" />
          {t('incidents.fields.notes')}
          <span className="text-gray-400 font-normal">({incident.notes?.length || 0})</span>
        </h3>

        {/* Note input */}
        <div className="flex gap-2 mb-4">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            className={`${textareaClass} flex-1`}
            rows={2}
            placeholder={t('incidents.notePlaceholder')}
            onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) handleAddNote() }}
          />
          <button
            onClick={handleAddNote}
            disabled={!noteText.trim()}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-sm font-medium rounded-lg transition-colors self-end"
          >
            {t('incidents.addNote')}
          </button>
        </div>

        {/* Notes list */}
        <div className="space-y-3">
          {(incident.notes || []).length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-600">Sin notas todavía.</p>
          ) : (
            [...incident.notes].reverse().map((note) => (
              <div key={note.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
                    {note.author?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{note.author || 'Anónimo'}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{formatDateTime(note.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{note.text}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title={t('incidents.deleteConfirm')}
        description={t('incidents.deleteConfirmDesc')}
        onConfirm={() => { remove(id); navigate('/incidents') }}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  )
}
