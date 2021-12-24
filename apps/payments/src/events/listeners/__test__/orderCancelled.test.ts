import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { OrderCancelledEvent, NatsClient, OrderStatus } from "@ahmedelsharkawyhelpers/ticketing-common"
import { OrderCancelledListener } from "../orderCancelled"
import { Order } from "../../../models"

const setup = async () => {
  const listener = new OrderCancelledListener(NatsClient.client)
  const orderId = new mongoose.Types.ObjectId().toHexString()
  const order = await Order.build({ id: orderId, price: 20, status: OrderStatus.CREATED, userId: "123456789", version: 0 }).save()
  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: 1,
    ticket: {
      id: " ticket.id",
    },
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { msg, data, order, listener }
}

it("updates the status of the order", async () => {
  const { msg, data, listener, order } = await setup()

  await listener.onMessage(data, msg)

  const foundOrder = await Order.findById(order.id)
  expect(foundOrder.status).toEqual(OrderStatus.CANCELLED)
  expect(foundOrder.version).toEqual(data.version)
})
