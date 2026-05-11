export type Settings = {
  serviceName: string
  apiBaseUrl: string
  authMode: 'custom'
  tokenTTL: number
  allowedOrigins: string[]
  webhookSecret: string
  defaultRoles: string[]
}
