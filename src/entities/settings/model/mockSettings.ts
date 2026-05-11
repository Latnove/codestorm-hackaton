import type { Settings } from './types'

export const mockSettings: Settings = {
  serviceName: 'MiniApp Platform',
  apiBaseUrl: '/api',
  authMode: 'custom',
  tokenTTL: 3600,
  allowedOrigins: ['https://example.com', 'https://miniapps.codestorm.local'],
  webhookSecret: 'mock-webhook-secret',
  defaultRoles: ['admin', 'user', 'analyst', 'support'],
}
