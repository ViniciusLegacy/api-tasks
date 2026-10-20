import { Router } from "express"

import { TasksStatusController } from "@/controllers/tasks-status-controller"

const tasksStatusRoutes = Router()
const tasksStatusController = new TasksStatusController()

tasksStatusRoutes.patch("/:id", tasksStatusController.update)

export { tasksStatusRoutes }