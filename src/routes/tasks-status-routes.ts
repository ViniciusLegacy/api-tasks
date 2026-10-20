import { Router } from "express"

import { TasksStatusController } from "@/controllers/tasks-status-controller"

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization"

const tasksStatusRoutes = Router()
const tasksStatusController = new TasksStatusController()

tasksStatusRoutes.use(ensureAuthenticated, verifyUserAuthorization(["admin", "member"]))
tasksStatusRoutes.patch("/:id", tasksStatusController.update)

export { tasksStatusRoutes }