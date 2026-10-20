import { Router } from "express"

import { TasksController } from "@/controllers/tasks-controller"

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization"

const tasksRoutes = Router()
const tasksController = new TasksController()

tasksRoutes.use(ensureAuthenticated, verifyUserAuthorization(["admin", "member"]))
tasksRoutes.post("/", tasksController.create)
tasksRoutes.get("/", tasksController.index)
tasksRoutes.put("/:id/update", tasksController.update)
tasksRoutes.delete("/:id/delete", tasksController.delete)

export { tasksRoutes }