import request from "supertest"
import { prisma } from "@/database/prisma"

import { app } from "@/app"

describe("TeamsController", () => {
    let team_id: string
    let user_id: string
    let user_fail_id: string

    afterAll(async () => {
        await prisma.user.delete({ where: { id: user_id } })
        await prisma.user.delete({ where: { id: user_fail_id } })
    })

    it("should create a new team sucessfully", async () => {
        const user = await request(app).post("/users").send({
            name: "Auth Test User",
            email: "auth_testuser@example.com",
            password: "password123",
        })

        user_id = user.body.id

        await prisma.user.update({
            where: { id: user_id },
            data: { role: "admin" }
        })

        const session = await request(app).post("/sessions").send({
            email: "auth_testuser@example.com",
            password: "password123"
        })

        const team = await request(app)
            .post("/teams")
            .set("Authorization", `Bearer ${session.body.token}`)
            .send({
                name: "Time de teste",
                description: "teste teste"
        })

        team_id = team.body.id

        expect(team.status).toBe(201)
        expect(team.body).toHaveProperty("id")
        expect(team.body.name).toBe("Time de teste")
    })

    it("it should fail to create a new team because it lacks permission", async () => {
        const userFail = await request(app).post("/users").send({
            name: "Auth Test User Fail",
            email: "auth_fail_testuser@example.com",
            password: "password123",
        })

        user_fail_id = userFail.body.id

        const session = await request(app).post("/sessions").send({
            email: "auth_fail_testuser@example.com",
            password: "password123"
        })

        const team = await request(app)
            .post("/teams")
            .set("Authorization", `Bearer ${session.body.token}`)
            .send({
                name: "Time de teste",
                description: "teste teste"
        })

        expect(team.status).toBe(401)
    })

    it("it should fail to create a new team because the token was not sent", async () => {
        await prisma.user.update({
            where: { id: user_id  },
            data: { role: "admin" }
        })

        const session = await request(app).post("/sessions").send({
            email: "auth_fail_testuser@example.com",
            password: "password123"
        })

        const team = await request(app)
            .post("/teams")
            .send({
                name: "Time de teste",
                description: "teste teste"
        })

        expect(team.status).toBe(401)
    })

    it("should successfully update the team information", async () => {
        const session = await request(app).post("/sessions").send({
            email: "auth_testuser@example.com",
            password: "password123"
        })
        
        const teamUpdated = await request(app)
            .put(`/teams/${team_id}`)
            .set("Authorization", `Bearer ${session.body.token}`)
            .send({
                name: "Teste alterado",
                description: "descrição alterada"
            })
        
        expect(teamUpdated.status).toBe(200)
    })

    it("it should not update because the name is not in the correct format", async () => {
        const session = await request(app).post("/sessions").send({
            email: "auth_testuser@example.com",
            password: "password123"
        })

        const teamUpdated = await request(app)
            .put(`/teams/${team_id}`)
            .set("Authorization", `Bearer ${session.body.token}`)
            .send({
                name: "Tt",
                description: "descrição alterada"
            })
        
        expect(teamUpdated.status).toBe(400)
    })

    it("the team should be deleted", async () => {
        const session = await request(app).post("/sessions").send({
            email: "auth_testuser@example.com",
            password: "password123"
        })

        const teamDeleted = await request(app)
            .delete(`/teams/${team_id}/remove`)
            .set("Authorization", `Bearer ${session.body.token}`)
        
        expect(teamDeleted.status).toBe(200)
    })
})