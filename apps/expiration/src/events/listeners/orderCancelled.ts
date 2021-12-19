import { EventQueueGroupNames, Listener, Subjects, OrderCancelledEvent } from "@ahmedelsharkawyhelpers/ticketing-common"
import { Message } from "node-nats-streaming"

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.ORDER_CANCELLED = Subjects.ORDER_CANCELLED
  // make sure only the event will send to only one listener form the group
  queueGroupName = EventQueueGroupNames.EXPIRATION_SERVICE
  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {}
}
