import express, { json } from "express"
import mongoose from "mongoose"
import "express-async-errors"
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
const main = async () => {
  try {
    await mongoose.connect("mongodb://authentication-database:27017/authentication")
    console.log("authentication db connected successfully")
  } catch (error) {
    console.log("authentication db connection error")
  }
  app.listen(3000, () => {
    console.log("Listing on port: 3000")
  })
}

main()
