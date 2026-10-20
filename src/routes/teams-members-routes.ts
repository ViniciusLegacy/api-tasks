import { Router } from "express"

import { TeamsMembersController } from "@/controllers/teams-members-controllers"

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization"

const teamsMembersRoutes = Router()
const teamsMembersController = new TeamsMembersController()

teamsMembersRoutes.use(ensureAuthenticated, verifyUserAuthorization(["admin"]))
teamsMembersRoutes.post("/:team_id/add", teamsMembersController.create)

export { teamsMembersRoutes }