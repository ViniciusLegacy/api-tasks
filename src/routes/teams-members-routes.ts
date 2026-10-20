import { Router } from "express"

import { TeamsMembersController } from "@/controllers/teams-members-controllers"

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization"

const teamsMembersRoutes = Router()
const teamsMembersController = new TeamsMembersController()

teamsMembersRoutes.use(ensureAuthenticated)
teamsMembersRoutes.post("/:team_id/add", verifyUserAuthorization(["admin"]), teamsMembersController.create)
teamsMembersRoutes.delete("/:id/remove", verifyUserAuthorization(["admin"]), teamsMembersController.delete)

export { teamsMembersRoutes }