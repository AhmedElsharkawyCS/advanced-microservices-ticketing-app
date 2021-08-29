import { Router } from "express"

const router = Router()

router.get("/users/me", (req, res, next) => {
  res.send("Hi user!")
})

export { router as meRouter }
