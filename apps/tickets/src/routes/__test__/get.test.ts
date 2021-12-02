import request from "supertest"
import mongoose from "mongoose"
import { app } from "../../app"

describe("Test get tickets", () => {
  it("Should return 404 if ticket id not found", async () => {
    const cookies = global.login()
    const id = new mongoose.Types.ObjectId().toHexString()
    const res = await request(app).get(`/api/tickets/${id}`).set("Cookie", cookies).send()
    expect(res.status).toEqual(404)
  })
  it("Should return 200 if ticket found", async () => {
    const cookies = global.login()
    const createRes = await request(app).post("/api/tickets").set("Cookie", cookies).send({ title: "ticket title", price: 20 })
    expect(createRes.status).toEqual(201)
    const res = await request(app).get(`/api/tickets/${createRes.body.id}`).set("Cookie", cookies).send()
    expect(res.status).toEqual(200)
    expect(res.body.title).toEqual(createRes.body.title)
    expect(res.body.price).toEqual(createRes.body.price)
  })
  it("Should return 200 if tickets found", async () => {
    const cookies = global.login()
    await request(app).post("/api/tickets").set("Cookie", cookies).send({ title: "ticket title1", price: 20 }).expect(201)
    await request(app).post("/api/tickets").set("Cookie", cookies).send({ title: "ticket title1", price: 7 }).expect(201)
    await request(app).post("/api/tickets").set("Cookie", cookies).send({ title: "ticket title3", price: 10 }).expect(201)
    const res = await request(app).get(`/api/tickets/`).set("Cookie", cookies).send()
    expect(res.status).toEqual(200)
    expect(res.body.length).toEqual(3)
  })
  it("Should return 404 if tickets not found", async () => {
    const cookies = global.login()
    const res = await request(app).get(`/api/tickets`).set("Cookie", cookies).send()
    expect(res.status).toEqual(404)
  })
})
