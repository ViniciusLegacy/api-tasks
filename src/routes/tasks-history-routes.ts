import { Router } from "express"

import { TasksHistoryController } from "@/controllers/tasks-history-controller"

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization"

const tasksHistoryRoutes = Router()
const tasksHistoryController = new TasksHistoryController()

tasksHistoryRoutes.use(ensureAuthenticated, verifyUserAuthorization(["admin", "member"]))
tasksHistoryRoutes.post("/", tasksHistoryController.create)

export { tasksHistoryRoutes }