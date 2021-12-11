import request from "supertest"
import Mongoose from "mongoose"
import { OrderStatus } from "@ahmedelsharkawyhelpers/ticketing-common"
import { app } from "../../app"
import { Ticket, Order } from "../../models"

describe("Test create new order", () => {
  it("Has a route handler listening ro /api/orders for post request", async () => {
    const res = await request(app).post("/api/orders").send({})
    expect(res.status).not.toEqual(404)
  })
  it("Can only be accessed if the user logged in", async () => {
    const res = await request(app).post("/api/orders").send({})
    expect(res.status).toEqual(401)
  })
  it("Should return other than 401 if the user logged in", async () => {
    const cookies = global.login()
    const res = await request(app).post("/api/orders").set("Cookie", cookies).send()
    expect(res.status).not.toEqual(401)
  })
  it("Should return a 404 if ticketId not provided", async () => {
    const cookies = global.login()
    const id = new Mongoose.Types.ObjectId().toHexString()
    const res = await request(app).post("/api/orders").set("Cookie", cookies).send({ ticketId: id })
    expect(res.status).toEqual(404)
  })
  it("Should return a 400 if ticket already reserved", async () => {
    const id = new Mongoose.Types.ObjectId().toHexString()
    const ticket = await Ticket.build({ price: 20, title: "ticket", id }).save()
    expect(ticket.price).toEqual(20)
    const cookies = global.login()
    await Order.build({ ticket, expireAt: new Date(), status: OrderStatus.CREATED, userId: "123456789" }).save()
    const res = await request(app).post("/api/orders").set("Cookie", cookies).send({ ticketId: ticket.id })
    expect(res.status).toEqual(400)
  })
  it("Should create a ticket if require data is valid", async () => {
    const id = new Mongoose.Types.ObjectId().toHexString()
    const ticket = await Ticket.build({ price: 20, title: "ticket", id }).save()
    expect(ticket.price).toEqual(20)
    const cookies = global.login()
    const res = await request(app).post("/api/orders").set("Cookie", cookies).send({ ticketId: ticket.id })
    expect(res.status).toEqual(201)
    expect(res.body.status).toEqual(OrderStatus.CREATED)
  })
})
