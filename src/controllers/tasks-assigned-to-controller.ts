import { Request, Response } from "express"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
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

        const task = await prisma.task.findUnique({ where: { id } })

        if(!task){
            throw new AppError("Task not found", 404)
        }

        if(request.user?.role !== "admin" && task.assignedTo !== request.user?.id) {
            throw new AppError("You can only manage your own tasks", 403)
        }

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