import { Request, Response } from "express"
import { prisma } from "@/database/prisma"
import { z } from "zod"

class TasksStatusController {
    async update(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.uuid(),
        })

        const bodySchema = z.object({
            status: z.enum(["pending", "in_progress", "completed"]),
        })

        const { id } = paramsSchema.parse(request.params)
        const { status } = bodySchema.parse(request.body)

        await prisma.task.update({
            data: {
                status,
            },
            where: {
                id,
            },
        })

        return response.json("Tasks status updated sucessfull")
    }
}

export { TasksStatusController }