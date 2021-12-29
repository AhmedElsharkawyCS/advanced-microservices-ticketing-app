import request from "supertest"
import { app } from "../../app"

describe("Test logout", () => {
  it("should return 200 on successful login", async () => {
    await signin()
    const res = await request(app).post("/api/users/signout").send().expect(200)
    expect(res.get("Set-Cookie")[0]).toEqual("express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT")
  })
})
