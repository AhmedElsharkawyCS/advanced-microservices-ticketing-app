import mongoose from "mongoose"
import { OrderStatus } from "@ahmedelsharkawyhelpers/ticketing-common"
import { updateIfCurrentPlugin } from "mongoose-update-if-current"

interface OrderAttrs {
  status: OrderStatus
  userId: string
  price: number
  id: string
  version: number
}
export interface OrderDoc extends mongoose.Document {
  status: OrderStatus
  userId: string
  price: number
  id: string
  version: number
}
interface OrderModel extends mongoose.Model<OrderDoc> {
  build: (attr: OrderAttrs) => OrderDoc
  findByEvent(attrs: { id: string; version: number }): Promise<OrderDoc | null>
}

const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.CREATED,
    },
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
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

orderSchema.set("versionKey", "version")
orderSchema.plugin(updateIfCurrentPlugin)
orderSchema.statics.findByEvent = (data: { id: string; version: number }) => {
  return Order.findOne({ __id: data.id, version: data.version - 1 })
}
orderSchema.statics.build = ({ id, ...props }: OrderAttrs) => {
  return new Order({ _id: id, ...props })
}

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema)
export { Order, OrderStatus }
