import express, { json } from "express"
import { meRouter, signInRouter, signOutRouter, signUpRouter } from "./routes"
import { errorHandler } from "./middlewares"
import { NotFound } from "./errors"
const app = express()
const prefix = "/api"

app.use(json())
app.get(prefix + "/users", (req, res, next) => {
  res.send("Authentication service works fine.")
})
app.use(prefix, [meRouter, signInRouter, signUpRouter, signOutRouter])
app.all("*", () => {
  throw new NotFound()
})
app.use(errorHandler)

app.listen(3000, () => {
  console.log("Listing on port: 3000")
})
