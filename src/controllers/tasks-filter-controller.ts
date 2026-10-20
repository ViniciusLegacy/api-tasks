import { Request, Response } from "express"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { z } from "zod"

class TasksFilterController {
    async showByStatus(request: Request, response: Response) {
        const querySchema = z.object({
            // user_id: z.uuid(),
            status: z.enum(["pending", "in_progress", "completed"]),
        })

        const { status } = querySchema.parse(request.query)

        /*
        const userExists = await prisma.user.findFirst({ where: { id: user_id } })

        if(!userExists){
            throw new AppError("User not found!", 401)
        }
        */

        const tasks = await prisma.task.findMany({
            where: {
                status,
                // assignedTo: user_id,
            },
        })

        return response.json(tasks)
    }
}

export { TasksFilterController }