import { Router } from "express"

import { TasksController } from "@/controllers/tasks-controller"

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"

const tasksRoutes = Router()
const tasksController = new TasksController()

tasksRoutes.use(ensureAuthenticated)
tasksRoutes.post("/", tasksController.create)

export { tasksRoutes }