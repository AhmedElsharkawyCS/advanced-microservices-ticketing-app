import mongoose from "mongoose"
import { updateIfCurrentPlugin } from "mongoose-update-if-current"

interface TicketAttrs {
  price: number
  title: string
  userId: string
}
interface TicketModel extends mongoose.Model<TicketDoc> {
  build: (attr: TicketAttrs) => TicketDoc
}
interface TicketDoc extends mongoose.Document {
  price: number
  title: string
  userId: string
  id: string
  version: number
  orderId?: string
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
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
    },
  },
  {
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
ticketSchema.set("versionKey", "version")
ticketSchema.plugin(updateIfCurrentPlugin)
ticketSchema.statics.build = (props: TicketAttrs) => {
  return new Ticket(props)
}

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema)
export { Ticket }
