import mongoose from "mongoose"
import { NatsClient } from "@ahmedelsharkawyhelpers/ticketing-common"
import { app } from "./app"
import { TicketCreatedListener, TicketUpdatedListener } from "./events"

const main = async () => {
  await mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("orders db connected successfully"))
    .catch(() => console.log("orders db connection error"))
  await NatsClient.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, { url: process.env.NATS_URL })
    .then(() => {
      console.log("Connected to NATS!")
      new TicketCreatedListener(NatsClient.client).listen()
      new TicketUpdatedListener(NatsClient.client).listen()
      NatsClient.handleClientClosing()
    })
    .catch((err) => {
      console.log("NATS connection failed")
    })
  app.listen(3000, () => {
    console.log("Listing on port: 3000")
  })
}
main()
