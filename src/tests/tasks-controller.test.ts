import request from "supertest"
import { prisma } from "@/database/prisma"

import { app } from "@/app"

describe("TasksController", () => {
    let user_id: string
    let team_id: string
    let task_id: string

    afterAll(async () => {
        await prisma.user.delete({ where: { id: user_id } })
        await prisma.team.delete({ where: { id: team_id } })
    })

    it("the task should be created successfully", async () => {
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
                description: "teste teste para task"
        })

        team_id = team.body.id

        const task = await request(app)
            .post("/tasks")
            .set("Authorization", `Bearer ${session.body.token}`)
            .send({
                title: "Teste",
                description: "tarefa de teste",
                priority: "low",
                assigned_to: user_id,
                team_id
        })

        task_id = task.body.id

        expect(task.status).toBe(201)
        expect(task.body.title).toBe("Teste")
    })

    it("should fail to create a new task because the token was not sent", async () => {
        const session = await request(app).post("/sessions").send({
            email: "auth_testuser@example.com",
            password: "password123"
        })

        const task = await request(app)
            .post("/tasks")
            .send({
                title: "Teste",
                description: "tarefa de teste",
                priority: "low",
                assigned_to: user_id,
                team_id
        })

        expect(task.status).toBe(401)
    })

    it("The task should not be created because it contains non-standard information", async () => {
        const session = await request(app).post("/sessions").send({
            email: "auth_testuser@example.com",
            password: "password123"
        })

        const task = await request(app)
            .post("/tasks")
            .set("Authorization", `Bearer ${session.body.token}`)
            .send({
                title: "Teste",
                description: "tarefa de teste",
                priority: "very high",
                assigned_to: user_id,
                team_id
        })

        expect(task.status).toBe(400)
        expect(task.body.priority).toBe(undefined)
    })

    it("should successfully update the team information", async () => {
        const session = await request(app).post("/sessions").send({
            email: "auth_testuser@example.com",
            password: "password123"
        })

        const taskUpdated = await request(app)
            .put(`/tasks/${task_id}/update`)
            .set("Authorization", `Bearer ${session.body.token}`)
            .send({
                title: "Tarefa de teste",
                description: "teste teste tarefa",
                priority: "high"
            })
        
            expect(taskUpdated.status).toBe(200)
    })

    it("The task must be deleted.", async () => {
        const session = await request(app).post("/sessions").send({
            email: "auth_testuser@example.com",
            password: "password123"
        })

        const taskDeleted = await request(app)
            .delete(`/tasks/${task_id}/delete`)
            .set("Authorization", `Bearer ${session.body.token}`)
        
            expect(taskDeleted.status).toBe(200)
    })
})