import { NextFunction, Request, Response, Router } from "express"
import { currentUser, NotFound, requireAuth, validationRequest, NotAuthorizedError } from "@ahmedelsharkawyhelpers/ticketing-common"
import { body } from "express-validator"
import { Ticket } from "../models"

const router = Router()

router.put(
  "/tickets/:id",
  currentUser,
  requireAuth,
  [body("title").not().isEmpty().withMessage("Title is required"), body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0")],
  validationRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const found = await Ticket.findById(req.params.id)
    if (!found) throw new NotFound()
    if (found.userId !== req.user.id) throw new NotAuthorizedError()
    await found.set({ ...req.body }).save()
    res.status(200).send(found)
  },
)

export { router as updateRouter }
