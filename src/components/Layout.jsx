import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { useOverdueCheck } from '../hooks/useOverdueCheck'

const TITLES = {
  '/': 'dashboard.title',
  '/incidents': 'incidents.title',
  '/incidents/new': 'incidents.new',
  '/maintenance': 'maintenance.title',
  '/maintenance/new': 'maintenance.new',
  '/users': 'users.title',
}

function getTitle(pathname) {
  if (TITLES[pathname]) return TITLES[pathname]
  if (pathname.includes('/incidents/') && pathname.includes('/edit')) return 'incidents.edit'
  if (pathname.includes('/incidents/')) return 'incidents.detail'
  if (pathname.includes('/maintenance/') && pathname.includes('/edit')) return 'maintenance.edit'
  if (pathname.includes('/maintenance/')) return 'maintenance.detail'
  return 'app.name'
}

export function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()
  const { t } = useTranslation()

  useOverdueCheck()

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar
          onMenuClick={() => setSidebarOpen(true)}
          title={t(getTitle(pathname))}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
