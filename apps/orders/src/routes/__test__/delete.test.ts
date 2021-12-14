import request from "supertest"
import mongoose from "mongoose"
import { app } from "../../app"
import { Ticket } from "../../models"

describe("Test order delete", () => {
  it("Should return 404 if  delete order not found", async () => {
    const cookies = global.login()
    const id = new mongoose.Types.ObjectId().toHexString()
    const res = await request(app).delete(`/api/order/${id}`).set("Cookie", cookies).send()
    expect(res.status).toEqual(404)
  })
  it("Should return 401 if user not authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    const res = await request(app).delete(`/api/orders/${id}`).send()
    expect(res.status).toEqual(401)
  })

  it("Should return 204 if order has been cancelled/delete", async () => {
    const cookies = global.login()
    const id = new mongoose.Types.ObjectId().toHexString()
    const ticket = await Ticket.build({ price: 20, title: "ticket", id }).save()
    const orderRes = await request(app).post("/api/orders").set("Cookie", cookies).send({ ticketId: ticket.id })
    const res = await request(app).delete(`/api/orders/${orderRes.body.id}`).set("Cookie", cookies).send()
    expect(res.status).toEqual(204)
  })
})
