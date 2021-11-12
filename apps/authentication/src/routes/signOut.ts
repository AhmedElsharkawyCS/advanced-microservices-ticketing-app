import { Router } from "express"

const router = Router()
router.post("/users/signout", (req, res, next) => {
  req.session = null
  res.status(200).send()
})
export { router as signOutRouter }
