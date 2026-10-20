import { Router } from "express";

import { TasksAssignedToController } from "@/controllers/tasks-assigned-to-controller";

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";

const tasksAssignedToRoutes = Router()
const tasksAssignedToController = new TasksAssignedToController()

tasksAssignedToRoutes.use(ensureAuthenticated, verifyUserAuthorization(["admin", "member"]))
tasksAssignedToRoutes.patch("/:id", tasksAssignedToController.update)

export { tasksAssignedToRoutes }