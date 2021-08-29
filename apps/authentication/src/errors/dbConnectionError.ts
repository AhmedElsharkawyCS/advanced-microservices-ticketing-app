import { CustomError } from "./customError"

export class DBConnectionError extends CustomError {
  public reason = "Error connecting to the database"
  statusCode = 500
  constructor() {
    super("Error connecting to the database")
    Object.setPrototypeOf(this, DBConnectionError.prototype)
  }
  public serializeErrors() {
    return [{ message: this.reason }]
  }
}
