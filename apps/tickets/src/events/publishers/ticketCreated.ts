import { Publisher, Subjects, TicketCreatedEvent } from "@ahmedelsharkawyhelpers/ticketing-common"

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TICKET_CREATED = Subjects.TICKET_CREATED
}
