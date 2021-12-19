import { EventQueueGroupNames, Listener, Subjects, TicketUpdatedEvent } from "@ahmedelsharkawyhelpers/ticketing-common"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../models"
export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TICKET_UPDATED = Subjects.TICKET_UPDATED
  // make sure only the event will send to only one listener form the group
  queueGroupName = EventQueueGroupNames.ORDER_SERVICE
  async onMessage(data: TicketUpdatedEvent["data"], msg: Message): Promise<void> {
    const { price, title, id, version } = data
    try {
      const ticket = await Ticket.findByEvent({ id, version })
      if (!ticket) throw new Error("Ticket not found")
      await ticket.set({ title, price }).save()
      msg.ack()
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
