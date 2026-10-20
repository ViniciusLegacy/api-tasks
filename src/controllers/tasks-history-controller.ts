import { Request, Response } from "express"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { z } from "zod"

class TasksHistoryController {
    async create(request: Request, response: Response) {

        return response.json()
    }
}

export { TasksHistoryController }