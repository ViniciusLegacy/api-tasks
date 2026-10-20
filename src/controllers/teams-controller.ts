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

    async index(request: Request, response: Response) {
        const teams = await prisma.team.findMany({})

        return response.json(teams)
    }

    async update(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.uuid(),
        })

        const bodySchema = z.object({
            name: z.string(),
            description: z.string()
        })

        const { id } = paramsSchema.parse(request.params)
        const { name, description } = bodySchema.parse(request.body)

        await prisma.team.update({
            data: {
                name,
                description,
            },
            where: {
                id,
            }
        })

        return response.json({ message: "Team updatead succesfull" })
    }

    async delete(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.uuid(),
        })

        const { id } = paramsSchema.parse(request.params)

        await prisma.team.delete({
            where: {
                id,
            }
        })

        return response.json({ message: "Team deleted successfull" })
    }
}

export { TeamsController }
