import "express-async-errors"
import express, { json } from "express"
import cookieSession from "cookie-session"
import { meRouter, signInRouter, signOutRouter, signUpRouter } from "./routes"
import { errorHandler } from "./middlewares"
import { NotFound } from "./errors"
const app = express()
const prefix = "/api"
app.set("trust proxy", 1) // trust first proxy
app.use(json())
app.use(
  cookieSession({
    signed: false,
    httpOnly: false,
    secure: process.env.NODE_ENV !== "test",
  }),
)
app.get(prefix + "/users", (req, res, next) => {
  res.send("Authentication service works fine.")
})
app.use(prefix, [meRouter, signInRouter, signUpRouter, signOutRouter])
app.all("*", () => {
  throw new NotFound()
})
app.use(errorHandler)

export { app }
