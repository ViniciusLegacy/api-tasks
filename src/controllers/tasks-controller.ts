import { Request, Response } from "express"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { z } from "zod"


class TasksController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            title: z.string(),
            description: z.string(),
            priority: z.enum(["low", "medium", "high"]),
            assigned_to: z.uuid(),
            team_id: z.uuid(),
        })

        const { title, description, priority, assigned_to, team_id } = bodySchema.parse(request.body)

        const task = await prisma.task.create({
            data: {
                title,
                description,
                priority,
                assignedTo: assigned_to,
                teamId: team_id,
            },
        })

        return response.json(task)
    }
}

export { TasksController }