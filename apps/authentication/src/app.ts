import "express-async-errors"
import express, { json } from "express"
import cors from "cors"
import cookieSession from "cookie-session"
import { errorHandler, NotFound } from "@ahmedelsharkawyhelpers/ticketing-common"
import { meRouter, signInRouter, signOutRouter, signUpRouter } from "./routes"
//
const app = express()
const prefix = "/api"
app.use(cors())
app.set("trust proxy", 1)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    httpOnly: false,
    secure: process.env.NODE_ENV !== "test",
  }),
)
app.get(prefix, (req, res, next) => {
  res.send("Authentication service works fine.")
})
app.use(prefix, [meRouter, signInRouter, signUpRouter, signOutRouter])
app.all("*", () => {
  throw new NotFound()
})
app.use(errorHandler)

export { app }
