import mongoose from "mongoose"
import { updateIfCurrentPlugin } from "mongoose-update-if-current"
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
  version: number
  isReserved(): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc
  findByEvent(attrs: { id: string; version: number }): Promise<TicketDoc | null>
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

ticketSchema.set("versionKey", "version")
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.build = ({ id, ...attrs }: TicketAttrs) => {
  return new Ticket({ ...attrs, _id: id })
}
ticketSchema.statics.findByEvent = (data: { id: string; version: number }) => {
  return Ticket.findOne({ __id: data.id, version: data.version - 1 })
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
