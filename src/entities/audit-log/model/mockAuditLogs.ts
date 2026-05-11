import type { AuditLog } from './types'

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'audit-1',
    date: '2026-05-11T09:45:00.000Z',
    username: 'admin',
    action: 'miniapp_opened',
    entityType: 'miniapp',
    entityName: 'Schedule',
    status: 'success',
    details: 'Opened from dashboard',
  },
  {
    id: 'audit-2',
    date: '2026-05-10T17:30:00.000Z',
    username: 'analyst',
    action: 'miniapp_updated',
    entityType: 'miniapp',
    entityName: 'Reports Hub',
    status: 'success',
    details: 'Version changed to 0.9.4',
  },
  {
    id: 'audit-3',
    date: '2026-05-10T12:05:00.000Z',
    username: 'support',
    action: 'miniapp_disabled',
    entityType: 'miniapp',
    entityName: 'Support Desk',
    status: 'error',
    details: 'Healthcheck failed',
  },
]
