import mongoose from "mongoose"
import { NextFunction, Request, Response, Router } from "express"
import {
  currentUser,
  requireAuth,
  validationRequest,
  NotFound,
  BadRequestError,
  NotAuthorizedError,
  OrderStatus,
  NatsClient,
} from "@ahmedelsharkawyhelpers/ticketing-common"
import { body } from "express-validator"
import { Order, Payment } from "../models"
import { stripe } from "../stripe"
import { PaymentCreatedPublisher } from "../events"

const router = Router()

router.post(
  "/payments",
  currentUser,
  requireAuth,
  [
    body("orderId")
      .not()
      .isEmpty()
      .custom((id) => mongoose.Types.ObjectId.isValid(id))
      .withMessage("Order id must be provided"),
    body("token").not().isEmpty().withMessage("token must be provided"),
  ],
  validationRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { user, body } = req
    const { token, orderId } = body
    const order = await Order.findById(orderId)
    if (!order) throw new NotFound()
    if (user.id !== order.userId) throw new NotAuthorizedError()
    if (order.status === OrderStatus.CANCELLED) throw new BadRequestError("Cannot pay for an cancelled order ")
    const { id, status } = await stripe.charges.create({
      amount: order.price * 100,
      source: token,
      currency: "usd",
    })
    const payment = await Payment.build({ chargeId: id, status, order }).save()
    new PaymentCreatedPublisher(NatsClient.client).publish({ chargeId: payment.chargeId, id: payment.id, orderId: order.id })
    res.status(201).send(payment)
  },
)

export { router as createRouter }
