import { usersHandlers } from './users'
import { dashboardHandlers } from './dashboard'
import { authHandlers } from './auth'
import { settingsHandlers } from './settings'
import { profilesHandlers } from './profiles'

export const handlers = [
  ...usersHandlers,
  ...dashboardHandlers,
  ...authHandlers,
  ...settingsHandlers,
  ...profilesHandlers,
]
