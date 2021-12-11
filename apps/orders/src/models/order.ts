import mongoose from "mongoose"
import { OrderStatus } from "@ahmedelsharkawyhelpers/ticketing-common"
import { TicketDoc } from "./ticket"

interface OrderAttrs {
  status: OrderStatus
  expireAt: Date
  userId: string
  ticket: TicketDoc
}
interface OrderModel extends mongoose.Model<OrderDoc> {
  build: (attr: OrderAttrs) => OrderDoc
}
interface OrderDoc extends mongoose.Document {
  status: OrderStatus
  expireAt: Date
  userId: string
  ticket: TicketDoc
  id: string
}
const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.CREATED,
    },
    expireAt: {
      type: mongoose.Schema.Types.Date,
    },
    userId: {
      type: String,
      required: true,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  },
  {
    versionKey: false,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id
        delete ret._id
      },
    },
    toObject: {
      transform: (doc, ret) => {
        ret.id = ret._id
        delete ret._id
      },
    },
  },
)

orderSchema.statics.build = (props: OrderAttrs) => {
  return new Order(props)
}

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema)
export { Order, OrderStatus }
