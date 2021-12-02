import request from "supertest"
import { app } from "../../app"
import { Ticket } from "../../models"

describe("Test create new ticket", () => {
  it("Has a route handler listening ro /api/tickets for post request", async () => {
    const res = await request(app).post("/api/tickets").send({})
    expect(res.status).not.toEqual(404)
  })
  it("Can only be accessed if the user logged in", async () => {
    const res = await request(app).post("/api/tickets").send({})
    expect(res.status).toEqual(401)
  })
  it("Should return other than 401 if the user logged in", async () => {
    const cookies = global.login()
    const res = await request(app).post("/api/tickets").set("Cookie", cookies).send()
    expect(res.status).not.toEqual(401)
  })
  it("Should return an error if title not provided", async () => {
    const cookies = global.login()
    const res = await request(app).post("/api/tickets").set("Cookie", cookies).send({ title: "", price: 10 })
    expect(res.status).toEqual(400)
  })
  it("Should return an error if price not provided", async () => {
    const cookies = global.login()
    const res = await request(app).post("/api/tickets").set("Cookie", cookies).send({ title: "ticket title", price: -10 })
    expect(res.status).toEqual(400)
  })
  it("Should create a ticket if require data is valid", async () => {
    const tickets = await Ticket.find({})
    expect(tickets.length).toEqual(0)
    const cookies = global.login()
    const res = await request(app).post("/api/tickets").set("Cookie", cookies).send({ title: "ticket title", price: 20 })
    expect(res.status).toEqual(201)
    const ticketsAfter = await Ticket.find({})
    expect(ticketsAfter.length).toEqual(1)
    expect(ticketsAfter[0].price).toEqual(20)
  })
})
