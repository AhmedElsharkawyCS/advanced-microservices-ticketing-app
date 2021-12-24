import { Publisher, Subjects, ExpirationCompleteEvent } from "@ahmedelsharkawyhelpers/ticketing-common"

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.EXPIRATION_COMPLETE = Subjects.EXPIRATION_COMPLETE
}
