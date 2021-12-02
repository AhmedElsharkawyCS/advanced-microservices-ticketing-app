import mongoose from "mongoose"

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
  },
  {
    versionKey: false,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id
        delete ret.password
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

ticketSchema.statics.build = (props: TicketAttrs) => {
  return new Ticket(props)
}

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema)
export { Ticket }
