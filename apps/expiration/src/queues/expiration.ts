import { NatsClient } from "@ahmedelsharkawyhelpers/ticketing-common"
import Queue, { Job } from "bull"
import { ExpirationCompletePublisher } from "../events"

interface Payload {
  orderId: string
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: { host: process.env.REDIS_HOST },
})

expirationQueue.process(async (job: Job) => {
  const { orderId } = job.data
  new ExpirationCompletePublisher(NatsClient.client).publish({ orderId })
})

export { expirationQueue }
