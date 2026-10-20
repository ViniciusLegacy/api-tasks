import { Router } from "express";

import { TasksAssignedToController } from "@/controllers/tasks-assigned-to-controller";

const tasksAssignedToRoutes = Router()
const tasksAssignedToController = new TasksAssignedToController()

tasksAssignedToRoutes.patch("/:id", tasksAssignedToController.update)

export { tasksAssignedToRoutes }