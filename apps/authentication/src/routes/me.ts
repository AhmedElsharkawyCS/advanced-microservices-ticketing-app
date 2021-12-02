import { Router } from "express"
import { currentUser, requireAuth } from "@ahmedelsharkawyhelpers/ticketing-common"

const router = Router()

router.get("/me", currentUser, requireAuth, (req, res, next) => {
  res.status(200).send({ currentUser: req.user })
})

export { router as meRouter }
