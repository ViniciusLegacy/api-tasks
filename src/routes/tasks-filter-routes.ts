import { Router } from "express"

import { TasksFilterController } from "@/controllers/tasks-filter-controller"

const tasksFilterRoutes = Router()
const tasksFilterController = new TasksFilterController()

tasksFilterRoutes.get("/status", tasksFilterController.showByStatus)

export { tasksFilterRoutes }