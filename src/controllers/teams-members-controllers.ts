import { Request, Response } from "express"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { z } from "zod"

class TeamsMembersController {
    async create(request: Request, response: Response) {
        const paramsSchema = z.object({
            team_id: z.uuid(),
        })
        
        const bodySchema = z.object({
            user_id: z.uuid(),
        })

        const { team_id } = paramsSchema.parse(request.params)
        const { user_id } = bodySchema.parse(request.body)

        const userAlreadyExist = await prisma.teamMember.findFirst({ where: { teamId: team_id } })

        if(userAlreadyExist?.userId === user_id){
            throw new AppError("This user is already on the team")
        }

        const teamMember = await prisma.teamMember.create({
            data: {
                userId: user_id,
                teamId: team_id,
            },
            include: {
                user: { select: { name: true, email: true } },
                team: { select: { name: true, description: true } }
            }
        })

        return response.status(201).json(teamMember)
    }

    async delete(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.uuid(),
        })

        const { id } = paramsSchema.parse(request.params)

        await prisma.teamMember.delete({
            where: {
                id,
            }
        })

        return response.json({ message: "User removed successfull" })
    }
}

export { TeamsMembersController }
