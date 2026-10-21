import request from "supertest"
import { prisma } from "@/database/prisma"

import { app } from "@/app"

describe("SessionsController", () => {
    let user_id: string

    afterAll(async () => {
        
    })

    it("it should authenticated and get access token", async () => {
        const user = await request(app).post("/users").send({
            name: "Auth Test User",
            email: "auth_testuser@example.com",
            password: "password123"
        })

        user_id = user.body.id

        const sessionResponse = await request(app).post("/sessions").send({
            email: "auth_testuser@example.com",
            password: "password123"
        })

        expect(sessionResponse.status).toBe(200)
        expect(sessionResponse.body.token).toEqual(expect.any(String))
    })
})