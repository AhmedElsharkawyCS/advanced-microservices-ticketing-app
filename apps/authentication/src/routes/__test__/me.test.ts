import request from "supertest"
import { app } from "../../app"

describe("Test current user", () => {
  it("should return 200 with current user if cookie is valid", async () => {
    const cookie = await signin()
    const res = await request(app).get("/api/users/me").set("Cookie", cookie).send().expect(200)
    expect(res.body.currentUser.email).toEqual("test@test.com")
  })

  it("should return 401 if the user not authenticated", async () => {
    return request(app).get("/api/users/me").send().expect(401)
  })
})
