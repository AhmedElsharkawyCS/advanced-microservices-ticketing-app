import { OrderStatus } from "@ahmedelsharkawyhelpers/ticketing-common"
import request from "supertest"
import mongoose from "mongoose"
import { app } from "../../app"
import { Ticket, Order } from "../../models"

describe("Test get order", () => {
  it("Should return 404 if order id not found", async () => {
    const cookies = global.login()
    const id = new mongoose.Types.ObjectId().toHexString()
    const res = await request(app).get(`/api/orders/${id}`).set("Cookie", cookies).send()
    expect(res.status).toEqual(404)
  })
  it("Should return 404 if orders not found", async () => {
    const cookies = global.login()
    const res = await request(app).get(`/api/orders`).set("Cookie", cookies).send()
    expect(res.status).toEqual(404)
  })
  it("Should return 200 if order found", async () => {
    const cookies = global.login()
    const id = new mongoose.Types.ObjectId().toHexString()
    const ticket = await Ticket.build({ price: 20, title: "ticket", id }).save()
    const orderRes = await request(app).post("/api/orders").set("Cookie", cookies).send({ ticketId: ticket.id })
    const res = await request(app).get(`/api/orders/${orderRes.body.id}`).set("Cookie", cookies).send()
    expect(res.status).toEqual(200)
  })
  it("Should return 200 if orders found", async () => {
    const cookies = global.login()
    const id = new mongoose.Types.ObjectId().toHexString()
    const ticket = await Ticket.build({ price: 20, title: "ticket", id }).save()
    await request(app).post("/api/orders").set("Cookie", cookies).send({ ticketId: ticket.id })
    const res = await request(app).get(`/api/orders`).set("Cookie", cookies).send()
    expect(res.status).toEqual(200)
  })
})
