import mongoose from "mongoose"
import { NatsClient } from "@ahmedelsharkawyhelpers/ticketing-common"
import { app } from "./app"

const main = async () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("tickets db connected successfully"))
    .catch(() => console.log("tickets db connection error"))
  NatsClient.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, { url: process.env.NATS_URL })
    .then(() => {
      console.log("Connected to NATS!")
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
