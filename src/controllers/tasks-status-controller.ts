import { Request, Response } from "express"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
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

        const task = await prisma.task.findUnique({ where: { id } })

        if(!task){
            throw new AppError("Task not found", 404)
        }

        if(request.user?.role !== "admin" && task.assignedTo !== request.user?.id) {
            throw new AppError("You can only manage your own tasks", 403)
        }

        await prisma.task.update({
            data: {
                status,
            },
            where: {
                id,
            },
        })

        await prisma.taskHistory.create({
            data: {
                taskId: id,
                changedBy: request.user.id,
                oldStatus: task.status,
                newStatus: status,

            }
        })

        return response.json("Tasks status updated sucessfull")
    }
}

export { TasksStatusController }