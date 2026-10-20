import { Request, Response } from "express"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { z } from "zod"

class TasksHistoryController {
    async index(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.uuid(),
        })

        const { id } = paramsSchema.parse(request.params)

        const taskHistory = await prisma.taskHistory.findMany({
            where: {
                taskId: id,
            },
        })

        return response.json(taskHistory)
    }
}

export { TasksHistoryController }