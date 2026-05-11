export type MiniappStatus = 'draft' | 'published' | 'disabled'

export type Miniapp = {
  id: string
  name: string
  description?: string
  iconUrl?: string
  launchUrl: string
  version?: string
  status: MiniappStatus
  allowedRoles: string[]
  requiredPermissions?: string[]
  healthcheckUrl?: string
  webhookUrl?: string
  allowedOrigins?: string[]
  defaultTheme?: 'light' | 'dark' | 'system'
  defaultLocale?: string
  createdAt: string
  updatedAt: string
}
