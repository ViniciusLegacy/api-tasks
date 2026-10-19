import { Request, Response } from "express"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { compare } from "bcrypt"
import { z } from "zod"

class SessionsController {
    async create(request: Request, response: Response){
        const bodySchema = z.object({
            email: z.email(),
            password: z.string().min(6)
        })

        const { email, password } = bodySchema.parse(request.body)

        const user = await prisma.user.findFirst({ where: { email }, })

        if(!user){
            throw new AppError("Invalid email or password", 401)
        }

        const passwordMatched = await compare(password, user.password)

        if(!passwordMatched){
            throw new AppError("Invalid email or password", 401)
        }

        const { password: hashedPassword, ...userWithoutPassword } = user

        return response.json({ user: userWithoutPassword })
    }
}

export { SessionsController }