import { Request, Response } from "express"
import { prisma } from "@/database/prisma"
import { z } from "zod"

class TasksStatusController {
    async update(request: Request, response: Response) {

        return response.json()
    }
}

export { TasksStatusController }