import { EventQueueGroupNames, Listener, Subjects, OrderCreatedEvent } from "@ahmedelsharkawyhelpers/ticketing-common"
import { Message } from "node-nats-streaming"
import { expirationQueue } from "../../queues/expiration"

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.ORDER_CREATED = Subjects.ORDER_CREATED
  // make sure only the event will send to only one listener form the group
  queueGroupName = EventQueueGroupNames.EXPIRATION_SERVICE
  async onMessage(data: OrderCreatedEvent["data"], msg: Message): Promise<void> {
    const delay = new Date(data.expireAt).getTime() - new Date().getTime()
    await expirationQueue.add({ orderId: data.id }, { delay })
    msg.ack()
  }
}
