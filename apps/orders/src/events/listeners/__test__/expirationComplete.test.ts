import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { ExpirationCompleteEvent, NatsClient, OrderStatus } from "@ahmedelsharkawyhelpers/ticketing-common"
import { ExpirationCompleteListener } from "../expirationComplete"
import { Order, Ticket } from "../../../models"

const setup = async () => {
  // Create a listener
  const listener = new ExpirationCompleteListener(NatsClient.client)

  // Create and save a ticket
  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  }).save()

  const order = await Order.build({
    status: OrderStatus.CREATED,
    ticket,
    userId: "123456789",
    expireAt: new Date(),
  }).save()

  // Create a fake data object
  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  }

  // Create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  // return all of this stuff
  return { msg, data, ticket, order, listener }
}

it("update order status to cancelled", async () => {
  const { msg, data, order, listener } = await setup()
  await listener.onMessage(data, msg)
  const updatedOrder = await Order.findById(order.id)
  expect(updatedOrder!.status).toEqual(OrderStatus.CANCELLED)
  expect(msg.ack).toHaveBeenCalled()
})

it("emit order cancelled event", async () => {
  const { msg, data, order, listener } = await setup()
  await listener.onMessage(data, msg)
  expect(NatsClient.client.publish).toHaveBeenCalled()
})
