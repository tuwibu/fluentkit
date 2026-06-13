import { usersHandlers } from './users'
import { dashboardHandlers } from './dashboard'
import { authHandlers } from './auth'
import { settingsHandlers } from './settings'

export const handlers = [
  ...usersHandlers,
  ...dashboardHandlers,
  ...authHandlers,
  ...settingsHandlers,
]
