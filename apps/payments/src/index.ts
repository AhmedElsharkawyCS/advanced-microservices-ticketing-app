import mongoose from "mongoose"
import { NatsClient } from "@ahmedelsharkawyhelpers/ticketing-common"
import { OrderCancelledListener, OrderCreatedListener } from "./events"
import { app } from "./app"

const main = async () => {
  await mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("tickets db connected successfully"))
    .catch(() => console.log("tickets db connection error"))
  await NatsClient.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, { url: process.env.NATS_URL })
    .then(() => {
      console.log("Connected to NATS!")
      new OrderCancelledListener(NatsClient.client).listen()
      new OrderCreatedListener(NatsClient.client).listen()
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
