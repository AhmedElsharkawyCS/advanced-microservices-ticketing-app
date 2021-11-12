import mongoose from "mongoose"
import { Password } from "../services"

interface UserAttrs {
  email: string
  password: string
}
interface UserModel extends mongoose.Model<UserDoc> {
  build: (attr: UserAttrs) => Promise<UserAttrs & { _id: string }>
}
interface UserDoc extends mongoose.Document {
  password: string
  email: string
  //   createdAt: string
  //   updatedAt: string
}
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id
        delete ret.password
        delete ret._id
      },
    },
  },
)

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"))
    this.set("password", hashed)
  }
  done()
})

userSchema.statics.build = (props: UserAttrs) => {
  return new User(props).save()
}

const User = mongoose.model<UserDoc, UserModel>("User", userSchema)
export { User }
