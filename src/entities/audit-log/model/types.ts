export type AuditLog = {
  id: string
  date: string
  username: string
  action: string
  entityType: string
  entityName: string
  status: 'success' | 'error'
  details?: string
}
