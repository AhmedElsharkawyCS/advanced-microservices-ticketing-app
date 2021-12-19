import { EventQueueGroupNames, Listener, Subjects, OrderCreatedEvent } from "@ahmedelsharkawyhelpers/ticketing-common"
import { Message } from "node-nats-streaming"
import { TicketUpdatedPublisher } from "../publishers"
import { Ticket } from "../../models"

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.ORDER_CREATED = Subjects.ORDER_CREATED
  // make sure only the event will send to only one listener form the group
  queueGroupName = EventQueueGroupNames.TICKET_SERVICE
  async onMessage(data: OrderCreatedEvent["data"], msg: Message): Promise<void> {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id)
    // If no ticket, throw error
    if (!ticket) {
      throw new Error("Ticket not found")
    }

    // Mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: data.id })

    // Save the ticket
    await ticket.save()
    await new TicketUpdatedPublisher(this.client).publish(ticket)

    // ack the message
    msg.ack()
  }
}
