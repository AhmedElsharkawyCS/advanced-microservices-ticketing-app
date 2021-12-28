import { OrderStatus } from "@ahmedelsharkawyhelpers/ticketing-common"
import mongoose from "mongoose"
import request from "supertest"
import { app } from "../../app"
import { Order } from "../../models"
import { stripe } from "../../stripe"

jest.mock("../../stripe.ts")
const setup = () => {
  const data = { token: "tok_amex", orderId: new mongoose.Types.ObjectId().toHexString() }
  const userId = Date.now().toString()
  const cookies = global.login(userId)
  return { data, cookies, userId }
}
describe("Test create new payment", () => {
  it("returns a 404 if the order not found", async () => {
    const { cookies, data } = setup()
    const res = await request(app).post("/api/payments").set("Cookie", cookies).send(data)
    expect(res.status).toEqual(404)
  })
  it("returns a 401 if the order not belong to the logged in user", async () => {
    const { cookies, data } = setup()
    await Order.build({ id: data.orderId, price: 20, status: OrderStatus.CREATED, userId: "123456789", version: 0 }).save()
    const res = await request(app).post("/api/payments").set("Cookie", cookies).send(data)
    expect(res.status).toEqual(401)
  })
  it("returns a 400 if the order is already cancelled", async () => {
    const { cookies, data, userId } = setup()
    await Order.build({ id: data.orderId, price: 20, status: OrderStatus.CANCELLED, userId, version: 0 }).save()
    const res = await request(app).post("/api/payments").set("Cookie", cookies).send(data)
    expect(res.status).toEqual(400)
  })
  it("Should return a 201 order successfully paid", async () => {
    const { cookies, data, userId } = setup()
    await Order.build({ id: data.orderId, price: 20, status: OrderStatus.CREATED, userId, version: 0 }).save()
    const res = await request(app).post("/api/payments").set("Cookie", cookies).send(data)
    expect(res.status).toEqual(201)
    expect(stripe.charges.create).toHaveBeenCalled()
    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]
    expect(chargeOptions.source).toEqual("tok_amex")
    expect(chargeOptions.amount).toEqual(20 * 100)
    expect(chargeOptions.currency).toEqual("usd")
  })
})
