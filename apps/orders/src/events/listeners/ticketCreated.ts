import { EventQueueGroupNames, Listener, Subjects, TicketCreatedEvent } from "@ahmedelsharkawyhelpers/ticketing-common"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../models"
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TICKET_CREATED = Subjects.TICKET_CREATED
  // make sure only the event will send to only one listener form the group
  queueGroupName = EventQueueGroupNames.ORDER_SERVICE
  async onMessage(data: TicketCreatedEvent["data"], msg: Message): Promise<void> {
    const { price, title, id } = data
    try {
      await Ticket.build({ price, title, id }).save()
      msg.ack()
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
