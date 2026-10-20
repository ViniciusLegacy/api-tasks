import { Request, Response } from "express"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { z } from "zod"

class TasksFilterController {
    async showByStatus(request: Request, response: Response) {
        const querySchema = z.object({
            status: z.enum(["pending", "in_progress", "completed"]),
        })

        const { status } = querySchema.parse(request.query)

        const tasks = await prisma.task.findMany({
            where: {
                status,
            },
        })

        return response.json(tasks)
    }

    async showByPriority(request: Request, response: Response) {
        const querySchema = z.object({
            priority: z.enum(["low", "medium", "high"])
        })

        const { priority } = querySchema.parse(request.query)

        const tasks = await prisma.task.findMany({
            where: {
                priority,
            }
        })

        return response.json(tasks)
    }
}

export { TasksFilterController }