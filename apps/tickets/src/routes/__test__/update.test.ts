import request from "supertest"
import mongoose from "mongoose"
import { app } from "../../app"

describe("Test update tickets", () => {
  it("Should return 404 if ticket id not found", async () => {
    const cookies = global.login()
    const id = new mongoose.Types.ObjectId().toHexString()
    const res = await request(app).put(`/api/tickets/${id}`).set("Cookie", cookies).send({ price: 5, title: "test" })
    expect(res.status).toEqual(404)
  })
  it("Should return 401 if user not authenticated", async () => {
    const cookies = global.login()
    const createRes = await request(app).post("/api/tickets").set("Cookie", cookies).send({ title: "ticket title1", price: 20 })
    expect(createRes.status).toEqual(201)
    const res = await request(app).put(`/api/tickets/${createRes.body.id}`).send({ price: -5, title: "test" })
    expect(res.status).toEqual(401)
  })
  it("Should return 401 if user not owen the ticket", async () => {
    const cookies = global.login()
    const createRes = await request(app).post("/api/tickets").set("Cookie", cookies).send({ title: "ticket title1", price: 20 })
    expect(createRes.status).toEqual(201)
    const cookies2 = global.login()
    const res = await request(app).put(`/api/tickets/${createRes.body.id}`).set("Cookie", cookies2).send({ price: 5, title: "test" })
    expect(res.status).toEqual(401)
  })
  it("Should return 400 if ticket updated data not correct", async () => {
    const cookies = global.login()
    const createRes = await request(app).post("/api/tickets").set("Cookie", cookies).send({ title: "ticket title1", price: 20 })
    expect(createRes.status).toEqual(201)
    const res = await request(app).put(`/api/tickets/${createRes.body.id}`).set("Cookie", cookies).send({ price: -5, title: "" })
    expect(res.status).toEqual(400)
  })
  it("Should return 200 if tickets updated successfully", async () => {
    const cookies = global.login()
    const createRes = await request(app).post("/api/tickets").set("Cookie", cookies).send({ title: "ticket title1", price: 20 })
    expect(createRes.status).toEqual(201)
    const res = await request(app).put(`/api/tickets/${createRes.body.id}`).set("Cookie", cookies).send({ price: 100, title: "updated ticket" })
    expect(res.status).toEqual(200)
    const getRes = await request(app).get(`/api/tickets/${createRes.body.id}`).set("Cookie", cookies).send()
    expect(getRes.status).toEqual(200)
    expect(getRes.body.price).toEqual(100)
  })
})
