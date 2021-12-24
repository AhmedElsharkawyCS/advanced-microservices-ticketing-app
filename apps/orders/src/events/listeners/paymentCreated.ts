import { EventQueueGroupNames, Listener, Subjects, PaymentCreatedEvent, OrderStatus } from "@ahmedelsharkawyhelpers/ticketing-common"
import { Message } from "node-nats-streaming"
import { Order } from "../../models"
export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects = Subjects.PAYMENT_CREATED
  // make sure only the event will send to only one listener form the group
  queueGroupName = EventQueueGroupNames.ORDER_SERVICE
  async onMessage(data: PaymentCreatedEvent["data"], msg: Message): Promise<void> {
    const { orderId } = data
    try {
      const order = await Order.findById(orderId)
      if (!order) throw new Error("Order not found!")
      order.set({ status: OrderStatus.COMPLETE })
      await order.save()
      msg.ack()
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
