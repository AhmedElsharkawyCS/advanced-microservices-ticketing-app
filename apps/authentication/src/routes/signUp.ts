import { NextFunction, Request, Response, Router } from "express"
import { body as validator, validationResult } from "express-validator"
import { RequestValidationError, DBConnectionError } from "../errors"

const router = Router()

router.post(
  "/users/signup",
  [
    validator("email").isEmail().withMessage("Email must be valid"),
    validator("password").trim().isLength({ min: 4, max: 25 }).withMessage("Password must be between 4 and 25 chars"),
  ],
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) throw new RequestValidationError(errors.array())
    const { email, password } = req.body
    throw new DBConnectionError()
  },
)

export { router as signUpRouter }
