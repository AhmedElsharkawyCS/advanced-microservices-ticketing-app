import { NextFunction, Request, Response, Router } from "express"
import { currentUser, NotAuthorizedError, NotFound, requireAuth } from "@ahmedelsharkawyhelpers/ticketing-common"
import { Order } from "../models"

const router = Router()

router.get("/orders", currentUser, requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const orders = await Order.find({ userId: req.user.id }).populate("ticket").exec()
  if (orders.length <= 0) throw new NotFound()
  res.status(200).send(orders)
})
router.get("/orders/:id", currentUser, requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const order = await Order.findById(req.params.id).populate("ticket").exec()
  if (!order) throw new NotFound()
  if (order.userId !== req.user.id) throw new NotAuthorizedError()
  res.status(200).send(order)
})
export { router as getRouter }
