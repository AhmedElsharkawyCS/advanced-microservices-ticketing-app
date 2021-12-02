import { NextFunction, Request, Response, Router } from "express"
import { currentUser, NotFound, requireAuth } from "@ahmedelsharkawyhelpers/ticketing-common"
import { Ticket } from "../models"

const router = Router()

router.get("/tickets", currentUser, requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const tickets = await Ticket.find({})
  if (tickets.length <= 0) throw new NotFound()
  res.status(200).send(tickets)
})
router.get("/tickets/:id", currentUser, requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const found = await Ticket.findById(req.params.id)
  if (!found) throw new NotFound()
  res.status(200).send(found)
})
export { router as getRouter }
