import mongoose from "mongoose"
import { Order, OrderStatus } from "./order"

interface TicketAttrs {
  title: string
  price: number
  id: string
}

export interface TicketDoc extends mongoose.Document {
  title: string
  price: number
  id: string
  isReserved(): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      },
    },
  },
)

ticketSchema.statics.build = ({ id, ...attrs }: TicketAttrs) => {
  return new Ticket({ ...attrs, _id: id })
}
ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this as any,
    status: {
      $nin: [OrderStatus.CANCELLED],
    },
  })

  return !!existingOrder
}

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema)

export { Ticket }
