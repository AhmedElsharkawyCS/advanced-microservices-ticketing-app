import { Publisher, Subjects, OrderCreatedEvent } from "@ahmedelsharkawyhelpers/ticketing-common"

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.ORDER_CREATED = Subjects.ORDER_CREATED
}
