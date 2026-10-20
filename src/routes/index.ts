import { Router } from "express"

import { usersRoutes } from "./users-routes"
import { sessionsRoutes } from "./sessions-routes"
import { teamsRoutes } from "./teams-routes"
import { teamsMembersRoutes } from "./teams-members-routes"
import { tasksRoutes } from "./tasks-routes"
import { tasksFilterRoutes } from "./tasks-filter-routes"
import { tasksAssignedToRoutes } from "./tasks-asigned-to-routes"
import { tasksStatusRoutes } from "./tasks-status-routes"
import { tasksHistoryRoutes } from "./tasks-history-routes"

const routes = Router()

routes.use("/users", usersRoutes)
routes.use("/sessions", sessionsRoutes)
routes.use("/teams", teamsRoutes)
routes.use("/members", teamsMembersRoutes)
routes.use("/tasks", tasksRoutes)
routes.use("/tasks-filter", tasksFilterRoutes)
routes.use("/tasks-assigned-to", tasksAssignedToRoutes)
routes.use("/tasks-status", tasksStatusRoutes)
routes.use("/tasks-history", tasksHistoryRoutes)

export { routes }