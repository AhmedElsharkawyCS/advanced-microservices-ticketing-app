import { EventQueueGroupNames, Listener, Subjects, OrderCreatedEvent } from "@ahmedelsharkawyhelpers/ticketing-common"
import { Message } from "node-nats-streaming"
import { Order } from "../../models"

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.ORDER_CREATED = Subjects.ORDER_CREATED
  // make sure only the event will send to only one listener form the group
  queueGroupName = EventQueueGroupNames.PAYMENT_SERVICE
  async onMessage(data: OrderCreatedEvent["data"], msg: Message): Promise<void> {
    const { id, status, ticket, userId, version } = data
    try {
      await Order.build({ id, status, price: ticket.price, userId, version }).save()
      msg.ack()
    } catch (error) {
      throw new Error(error)
    }
  }
}
