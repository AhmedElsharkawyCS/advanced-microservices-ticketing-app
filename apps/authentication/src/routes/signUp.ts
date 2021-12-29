import { NextFunction, Request, Response, Router } from "express"
import JWT from "jsonwebtoken"
import { body as validator } from "express-validator"
import { validationRequest, BadRequestError } from "@ahmedelsharkawyhelpers/ticketing-common"
import { Password } from "../services"
import { User } from "../models"

const router = Router()

router.post(
  "/users/signup",
  [
    validator("email").isEmail().withMessage("Email must be valid"),
    validator("password").trim().isLength({ min: 4, max: 25 }).withMessage("Password must be between 4 and 25 chars"),
  ],
  validationRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body
    const findUser = await User.findOne({ email })
    if (findUser) throw new BadRequestError("This email address already exists")
    const hashedPass = await Password.toHash(password)
    const user = await User.build({ email, password: hashedPass }).save()
    const currentUser = { email: user.email, id: user.id }
    const userJwt = JWT.sign(currentUser, process.env.JWT_SECRET_KEY)
    req.session.jwt = userJwt
    res.status(201).send(currentUser)
  },
)

export { router as signUpRouter }
