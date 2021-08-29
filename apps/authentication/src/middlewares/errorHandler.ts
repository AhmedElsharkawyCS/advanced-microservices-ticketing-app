import { NextFunction, Request, Response } from "express"
import { CustomError } from "../errors/customError"

export const errorHandler = (err: Error, req: Request, res: Response, nxt: NextFunction) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() })
  }
  res.status(400).send({ errors: [{ message: err.message || "Something went wrong" }] })
}
