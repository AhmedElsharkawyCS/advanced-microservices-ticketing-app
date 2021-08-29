import { ValidationError } from "express-validator"
import { CustomError } from "./customError"

export class NotFound extends CustomError {
  statusCode = 404
  constructor() {
    super("Not found")
    Object.setPrototypeOf(this, NotFound.prototype)
  }
  public serializeErrors() {
    return [{ message: "not found" }]
  }
}
