import { Request, Response, NextFunction } from "express"
import JWT from "jsonwebtoken"

interface UserPayload {
  id: string
  email: string
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload
    }
  }
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.jwt) next()
  try {
    const payload = JWT.verify(req.session.jwt, process.env.JWT_SECRET_KEY) as UserPayload
    req.user = payload
    next()
  } catch (error) {
    next()
  }
}
