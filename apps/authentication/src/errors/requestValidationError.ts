import { ValidationError } from "express-validator"
import { CustomError } from "./customError"

export class RequestValidationError extends CustomError {
  statusCode = 400
  constructor(public errors: Array<ValidationError>) {
    super("Invalid request params")
    Object.setPrototypeOf(this, RequestValidationError.prototype)
  }
  public serializeErrors() {
    return this.errors.map(({ msg, param }) => {
      return { message: msg, field: param }
    })
  }
}
