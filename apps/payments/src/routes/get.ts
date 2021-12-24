import { NextFunction, Request, Response, Router } from "express"
import { currentUser, NotFound, requireAuth } from "@ahmedelsharkawyhelpers/ticketing-common"
import { Payment } from "../models"
const router = Router()

router.get("/payments", currentUser, requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const payments = await Payment.find({})
    .populate({ path: "order", match: { userId: req.user.id } })
    .exec()
  if (payments.length <= 0) throw new NotFound()
  res.status(200).send(payments)
})
router.get("/payments/:id", currentUser, requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const payment = await Payment.findById(req.params.id)
    .populate({ path: "order", match: { userId: req.user.id } })
    .exec()
  if (!payment) throw new NotFound()
  res.status(200).send(payment)
})
export { router as getRouter }
