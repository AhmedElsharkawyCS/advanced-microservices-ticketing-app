import mongoose from "mongoose"

interface UserAttrs {
  email: string
  password: string
}
interface UserDoc extends mongoose.Document {
  password: string
  email: string
  id: string
}

interface UserModel extends mongoose.Model<UserDoc> {
  build: (attr: UserAttrs) => UserDoc
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
    toObject: {
      transform: (doc, ret) => {
        ret.id = ret._id
        delete ret.password
        delete ret._id
      },
    },
  },
)

userSchema.statics.build = (props: UserAttrs) => {
  return new User(props)
}

const User = mongoose.model<UserDoc, UserModel>("User", userSchema)
export { User }
