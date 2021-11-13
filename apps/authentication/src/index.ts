import mongoose from "mongoose"
import { app } from "./app"

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
