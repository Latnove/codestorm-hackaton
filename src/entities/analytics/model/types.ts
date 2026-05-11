export type AnalyticsEvent = {
  id: string
  miniappId: string
  miniappName: string
  username: string
  event: 'launch' | 'error' | 'access_denied'
  createdAt: string
}
