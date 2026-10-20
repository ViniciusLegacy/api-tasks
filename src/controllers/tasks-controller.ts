import { Request, Response } from "express"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { z } from "zod"


class TasksController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            title: z.string(),
            description: z.string().optional(),
            priority: z.enum(["low", "medium", "high"]),
            team_id: z.uuid(),
        })

        const { title, description, priority, team_id } = bodySchema.parse(request.body)

        const task = await prisma.task.create({
            data: {
                title,
                description,
                priority,
                teamId: team_id,
            },
        })

        return response.status(201).json(task)
    }

    async index(request: Request, response: Response) {
        const tasks = await prisma.task.findMany({})

        return response.json(tasks)
    }

    async update(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.uuid(),
        })
        
        const bodySchema = z.object({
            title: z.string().optional(),
            description: z.string().optional(),
            priority: z.enum(["low", "medium", "high"]).optional()
        })

        const { id } = paramsSchema.parse(request.params)
        const { title, description, priority } = bodySchema.parse(request.body)

        await prisma.task.update({
            data: {
                title,
                description,
                priority,
            },
            where: {
                id,
            }
        })

        return response.json({ message: "Task updated successfull" })
    }
}

export { TasksController }