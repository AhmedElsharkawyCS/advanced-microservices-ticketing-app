import { Message } from "node-nats-streaming"
import mongoose from "mongoose"
import { OrderCreatedEvent, OrderStatus, NatsClient } from "@ahmedelsharkawyhelpers/ticketing-common"
import { OrderCreatedListener } from "../orderCreated"
import { Order } from "../../../models"

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(NatsClient.client)
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.CREATED,
    userId: "alskdfj",
    expireAt: "alskdjf",
    ticket: {
      id: "ticket.id",
      price: 300,
      title: "bla bla",
    },
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg }
}

it("replicates the order info", async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)
  const order = await Order.findById(data.id)
  expect(data.ticket.price).toEqual(order.price)
})

it("acks the message", async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})
