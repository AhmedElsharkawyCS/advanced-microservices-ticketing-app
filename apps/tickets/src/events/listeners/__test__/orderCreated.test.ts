import { Message } from "node-nats-streaming"
import mongoose from "mongoose"
import { OrderCreatedEvent, OrderStatus, NatsClient } from "@ahmedelsharkawyhelpers/ticketing-common"
import { OrderCreatedListener } from "../orderCreated"
import { Ticket } from "../../../models/ticket"

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(NatsClient.client)

  // Create and save a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 99,
    userId: "asdf",
  })
  await ticket.save()

  // Create the fake data event
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.CREATED,
    userId: "alskdfj",
    expireAt: "alskdjf",
    ticket: {
      id: ticket.id,
      price: ticket.price,
      title: "bla bla",
    },
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, ticket, data, msg }
}

it("sets the userId of the ticket", async () => {
  const { listener, ticket, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.orderId).toEqual(data.id)
})

it("acks the message", async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})

it("publishes a ticket update event", async () => {
  const { listener, data, msg, ticket } = await setup()
  await listener.onMessage(data, msg)

  expect(NatsClient.client.publish).toHaveBeenCalled()
})
