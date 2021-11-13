import { Response, Router, Request, NextFunction } from "express"
import { body } from "express-validator"
import JWT from "jsonwebtoken"
import { BadRequestError } from "../errors"
import { validationRequest } from "../middlewares"
import { User } from "../models"
import { Password } from "../services"

const router = Router()

router.post(
  "/users/signin",
  [body("email").isEmail().withMessage("Email must be valid"), body("password").trim().notEmpty().withMessage("You must supply a password")],
  validationRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { password, email } = req.body
    const user = await User.findOne({ email })
    if (!user) throw new BadRequestError("Invalid user credentials")
    if (!(await Password.compare(user.password, password))) throw new BadRequestError("Invalid user credentials")
    const currentUser = { email: user.email, id: user._id }
    const userJwt = JWT.sign(currentUser, process.env.JWT_SECRET_KEY)
    req.session.jwt = userJwt
    res.status(200).send(currentUser)
  },
)

export { router as signInRouter }
