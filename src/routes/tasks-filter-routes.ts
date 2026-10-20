import { Router } from "express"

import { TasksFilterController } from "@/controllers/tasks-filter-controller"

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization"

const tasksFilterRoutes = Router()
const tasksFilterController = new TasksFilterController()

tasksFilterRoutes.use(ensureAuthenticated, verifyUserAuthorization(["admin", "member"]))
tasksFilterRoutes.get("/status", tasksFilterController.showByStatus)
tasksFilterRoutes.get("/priority", tasksFilterController.showByPriority)

export { tasksFilterRoutes }