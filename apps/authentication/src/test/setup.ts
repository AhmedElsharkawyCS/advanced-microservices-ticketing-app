import request from "supertest"
import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import { app } from "../app"

declare global {
  var signin: () => Promise<string[]>
}

let mongo: any
beforeAll(async () => {
  process.env.JWT_SECRET_KEY = "123456"
  mongo = await MongoMemoryServer.create()
  const mongoUri = mongo.getUri()
  await mongoose.connect(mongoUri)
})
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections()
  for (const collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop?.()
  await mongoose.connection.close()
})

global.signin = async () => {
  const email = "test@test.com"
  const password = "test"
  const res = await request(app).post("/api/users/signup").send({ email: email, password: password }).expect(201)
  return res.get("Set-Cookie")
}
