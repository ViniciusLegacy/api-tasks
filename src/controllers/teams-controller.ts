import { Request, Response } from "express"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { z } from "zod"

class TeamsController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            name: z.string().min(3),
            description: z.string()
        })

        const { name, description } = bodySchema.parse(request.body)

        const teamWithSameName = await prisma.team.findFirst({ where: { name } })

        if(teamWithSameName){
            throw new AppError("Team with same name already exists",)
        }

        const team = await prisma.team.create({
            data: {
                name,
                description,
            },
        })

        return response.status(201).json(team)
    }
}

export { TeamsController }
