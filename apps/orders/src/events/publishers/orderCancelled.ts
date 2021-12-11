import { Publisher, Subjects, OrderCancelledEvent } from "@ahmedelsharkawyhelpers/ticketing-common"

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.ORDER_CANCELLED = Subjects.ORDER_CANCELLED
}
