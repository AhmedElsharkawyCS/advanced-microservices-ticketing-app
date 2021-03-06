import { NextFunction, Request, Response, Router } from "express"
import {
  currentUser,
  NotFound,
  requireAuth,
  OrderStatus,
  NotAuthorizedError,
  NatsClient,
  BadRequestError,
} from "@ahmedelsharkawyhelpers/ticketing-common"
import { Order } from "../models"
import { OrderCancelledPublisher } from "../events"

const router = Router()

router.delete("/orders/:id", currentUser, requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const order = await Order.findById(req.params.id).populate("ticket")
  if (!order) throw new NotFound()
  if (order.userId !== req.user.id) throw new NotAuthorizedError()
  if (order.status === OrderStatus.CANCELLED) throw new BadRequestError("Order already cancelled")
  if (order.status === OrderStatus.COMPLETE) throw new BadRequestError("Cannot cancel a completed order")
  await order.set({ status: OrderStatus.CANCELLED }).save()
  new OrderCancelledPublisher(NatsClient.client).publish({ id: order.id, version: order.version, ticket: { id: order.ticket.id } })
  res.status(204).send(order)
})

export { router as deleteRouter }
