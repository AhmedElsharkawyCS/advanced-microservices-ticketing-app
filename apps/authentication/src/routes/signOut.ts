import { Router } from "express"

const router = Router()
router.post("/signout", (req, res, next) => {
  req.session = null
  res.status(200).send()
})
export { router as signOutRouter }
