import { EventQueueGroupNames, Listener, Subjects, OrderCancelledEvent, OrderStatus } from "@ahmedelsharkawyhelpers/ticketing-common"
import { Message } from "node-nats-streaming"
import { Order } from "../../models"

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.ORDER_CANCELLED = Subjects.ORDER_CANCELLED
  // make sure only the event will send to only one listener form the group
  queueGroupName = EventQueueGroupNames.TICKET_SERVICE
  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const { id, version } = data
    try {
      const order = await Order.findByEvent({ id, version })
      if (!order) {
        throw new Error("Order not found")
      }
      order.set({ status: OrderStatus.CANCELLED })
      await order.save()
      msg.ack()
    } catch (error) {
      throw new Error(error)
    }
  }
}
