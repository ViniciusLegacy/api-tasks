import { Request, Response } from "express"
import { prisma } from "@/database/prisma"
import { z } from "zod"

class TasksAssignedToController {
    async update(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.uuid(),
        })

        const bodySchema = z.object({
            user_id: z.uuid()
        })

        const { id } = paramsSchema.parse(request.params)
        const { user_id } = bodySchema.parse(request.body)

        await prisma.task.update({
            data: {
                assignedTo: user_id,
            },
            where: {
                id,
            }
        })

        return response.json("User successfully assigned to the task")
    }
}

export { TasksAssignedToController }