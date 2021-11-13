import request from "supertest"
import { app } from "../../app"

describe("Test signup", () => {
  it("should return 201 on successful register", async () => {
    return request(app).post("/api/users/signup").send({ email: "test@test.com", password: "test" }).expect(201)
  })

  it("should return 400 with invalid email", async () => {
    return request(app).post("/api/users/signup").send({ email: "test.com", password: "test" }).expect(400)
  })

  it("should return 400 with invalid password", async () => {
    return request(app).post("/api/users/signup").send({ email: "test@test.com", password: "t" }).expect(400)
  })

  it("should return 400 with with missing password and email", async () => {
    return request(app).post("/api/users/signup").send({}).expect(400)
  })

  it("should return 400 if the user try to register with existing email", async () => {
    await signin()
    await request(app).post("/api/users/signup").send({ email: "test@test.com", password: "test" }).expect(400)
  })

  it("should set cookie after successful register", async () => {
    const res = await request(app).post("/api/users/signup").send({ email: "test@test.com", password: "test" }).expect(201)
    expect(res.get("Set-Cookie")).toBeDefined()
  })
})
