import { Listener, Subjects, ExpirationCompleteEvent, EventQueueGroupNames, OrderStatus } from "@ahmedelsharkawyhelpers/ticketing-common"
import { Message } from "node-nats-streaming"
import { OrderCancelledPublisher } from "../publishers"
import { Order } from "../../models"

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.EXPIRATION_COMPLETE = Subjects.EXPIRATION_COMPLETE
  queueGroupName = EventQueueGroupNames.ORDER_SERVICE
  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message): Promise<void> {
    const { orderId } = data
    try {
      const order = await Order.findById(orderId).populate("ticket").exec()
      if (!order) throw new Error("Order not found")
      if (order.status === OrderStatus.COMPLETE) return msg.ack()
      order.set({ status: OrderStatus.CANCELLED })
      await order.save()
      //publish an event to the ticket
      await new OrderCancelledPublisher(this.client).publish({ id: order.id, version: order.version, ticket: { id: order.ticket.id } })
      msg.ack()
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
