import { EventQueueGroupNames, Listener, Subjects, OrderCancelledEvent } from "@ahmedelsharkawyhelpers/ticketing-common"
import { Message } from "node-nats-streaming"
import { TicketUpdatedPublisher } from "../publishers"
import { Ticket } from "../../models"
export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.ORDER_CANCELLED = Subjects.ORDER_CANCELLED
  // make sure only the event will send to only one listener form the group
  queueGroupName = EventQueueGroupNames.TICKET_SERVICE
  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id)

    if (!ticket) {
      throw new Error("Ticket not found")
    }

    ticket.set({ orderId: undefined })
    await ticket.save()
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      orderId: ticket.orderId,
      userId: ticket.userId,
      price: ticket.price,
      title: ticket.title,
      version: ticket.version,
    })

    msg.ack()
  }
}
