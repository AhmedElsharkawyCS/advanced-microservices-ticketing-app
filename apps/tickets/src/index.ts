import mongoose from "mongoose"
import { app } from "./app"

const main = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log("tickets db connected successfully")
  } catch (error) {
    console.log("tickets db connection error")
  }
  app.listen(3000, () => {
    console.log("Listing on port: 3000")
  })
}

main()
