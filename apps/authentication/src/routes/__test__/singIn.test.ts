import request from "supertest"
import { app } from "../../app"

describe("Test signin", () => {
  it("should return 200 on successful login", async () => {
    await signin()
    await request(app).post("/api/users/signin").send({ email: "test@test.com", password: "test" }).expect(200)
  })

  it("should return 400 on failed login", async () => {
    await signin()
    await request(app).post("/api/users/signin").send({ email: "ahmed@test.com", password: "test" }).expect(400)
  })

  it("should return 400 with invalid email", async () => {
    return request(app).post("/api/users/signin").send({ email: "test.com", password: "test" }).expect(400)
  })

  it("should return 400 with invalid password", async () => {
    return request(app).post("/api/users/signin").send({ email: "test@test.com", password: "t" }).expect(400)
  })

  it("should return 400 with with missing password and email", async () => {
    return request(app).post("/api/users/signin").send({}).expect(400)
  })
})
