import { NextFunction, Request, Response, Router } from "express"
import { currentUser, requireAuth, validationRequest, NatsClient } from "@ahmedelsharkawyhelpers/ticketing-common"
import { body } from "express-validator"
import { TicketCreatedPublisher } from "../events"
import { Ticket } from "../models"

const router = Router()

router.post(
  "/tickets",
  currentUser,
  requireAuth,
  [body("title").not().isEmpty().withMessage("Title is required"), body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0")],
  validationRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const created = await Ticket.build({ ...req.body, userId: req.user?.id }).save()
    new TicketCreatedPublisher(NatsClient.client).publish(created)
    res.status(201).send(created)
  },
)

export { router as createRouter }
