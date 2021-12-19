import { NatsClient } from "@ahmedelsharkawyhelpers/ticketing-common"
import { OrderCreatedListener } from "./events"

const main = async () => {
  NatsClient.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, { url: process.env.NATS_URL })
    .then(() => {
      console.log("Connected to NATS!")
      new OrderCreatedListener(NatsClient.client).listen()
      NatsClient.handleClientClosing()
    })
    .catch((err) => {
      console.log("NATS connection failed")
    })
}
main()
