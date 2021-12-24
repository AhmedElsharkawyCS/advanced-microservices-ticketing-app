import { Publisher, PaymentCreatedEvent, Subjects } from "@ahmedelsharkawyhelpers/ticketing-common"

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects = Subjects.PAYMENT_CREATED
}
