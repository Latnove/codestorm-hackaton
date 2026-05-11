import type { AnalyticsEvent } from './types'

export const mockAnalyticsEvents: AnalyticsEvent[] = [
  {
    id: 'event-1',
    miniappId: 'schedule',
    miniappName: 'Schedule',
    username: 'guest',
    event: 'launch',
    createdAt: '2026-05-11T08:20:00.000Z',
  },
  {
    id: 'event-2',
    miniappId: 'schedule',
    miniappName: 'Schedule',
    username: 'manager',
    event: 'launch',
    createdAt: '2026-05-11T09:10:00.000Z',
  },
  {
    id: 'event-3',
    miniappId: 'reports',
    miniappName: 'Reports Hub',
    username: 'analyst',
    event: 'error',
    createdAt: '2026-05-10T17:30:00.000Z',
  },
  {
    id: 'event-4',
    miniappId: 'support',
    miniappName: 'Support Desk',
    username: 'support',
    event: 'access_denied',
    createdAt: '2026-05-10T12:05:00.000Z',
  },
]
