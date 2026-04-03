import client from '@/api/client'
import type { AnalyticsData, UserBadgeStatus } from '@/types'

export const analyticsApi = {
  getAnalytics: async (): Promise<AnalyticsData> => {
    const data = await client.get<unknown, AnalyticsData>('/analytics')
    return data
  },

  getBadges: async (): Promise<{ badges: UserBadgeStatus[] }> => {
    const data = await client.get<unknown, { badges: UserBadgeStatus[] }>('/badges')
    return data
  },
}
