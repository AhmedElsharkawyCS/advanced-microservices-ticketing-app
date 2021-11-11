import { NextFunction, Request, Response, Router } from "express"
import JWT from "jsonwebtoken"
import { body as validator, validationResult } from "express-validator"
import { BadRequestError, RequestValidationError } from "../errors"
import { User } from "../models"

const router = Router()

router.post(
  "/users/signup",
  [
    validator("email").isEmail().withMessage("Email must be valid"),
    validator("password").trim().isLength({ min: 4, max: 25 }).withMessage("Password must be between 4 and 25 chars"),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array())
    }
    const { email, password } = req.body
    const findUser = await User.findOne({ email })
    if (findUser) throw new BadRequestError("Email in use")
    const user = await User.build({ email, password })
    delete user.password
    const userJwt = JWT.sign(user, "secret key")
    req.session.jwt = userJwt
    res.status(201).send(user)
  },
)

export { router as signUpRouter }
