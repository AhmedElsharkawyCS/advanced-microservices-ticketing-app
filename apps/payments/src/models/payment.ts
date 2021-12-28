import mongoose from "mongoose"
import { OrderDoc } from "./order"

interface PaymentAttrs {
  chargeId: string
  status: string
  order: OrderDoc
}
interface PaymentDoc extends mongoose.Document {
  chargeId: string
  status: string
  order: OrderDoc
}
interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build: (attr: PaymentAttrs) => PaymentDoc
}

const paymentSchema = new mongoose.Schema(
  {
    chargeId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
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

paymentSchema.statics.build = (props: PaymentAttrs) => {
  return new Payment(props)
}

const Payment = mongoose.model<PaymentDoc, PaymentModel>("Payment", paymentSchema)
export { Payment }
