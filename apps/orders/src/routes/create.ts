import mongoose from "mongoose"
import { NextFunction, Request, Response, Router } from "express"
import {
  currentUser,
  requireAuth,
  validationRequest,
  NatsClient,
  NotFound,
  BadRequestError,
  OrderStatus,
} from "@ahmedelsharkawyhelpers/ticketing-common"
import { body } from "express-validator"
import { Order, Ticket } from "../models"
import { OrderCreatedPublisher } from "../events"

const router = Router()
router.post(
  "/orders",
  currentUser,
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((id) => mongoose.Types.ObjectId.isValid(id))
      .withMessage("TicketId must be provided"),
  ],
  validationRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const ticket = await Ticket.findById(req.body.ticketId).exec()
    if (!ticket) throw new NotFound()
    const isReserved = await ticket.isReserved()
    if (isReserved) throw new BadRequestError("Ticket is already reserved")
    const expiration = new Date()
    //1 minute
    expiration.setSeconds(expiration.getSeconds() + 15 * 60)
    const order = await Order.build({
      expireAt: expiration,
      status: OrderStatus.CREATED,
      ticket,
      userId: req.user.id,
    }).save()
    new OrderCreatedPublisher(NatsClient.client).publish({
      ...order,
      expireAt: order.expireAt.toISOString(),
    })
    res.status(201).send(order)
  },
)

export { router as createRouter }
