import JWT from "jsonwebtoken"
import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"

declare global {
  var login: (id?: string) => string[]
}

let mongo: any
beforeAll(async () => {
  process.env.JWT_SECRET_KEY = "123456"
  mongo = await MongoMemoryServer.create()
  const mongoUri = mongo.getUri()
  await mongoose.connect(mongoUri)
})
beforeEach(async () => {
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections()
  for (const collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop?.()
  await mongoose.connection.close()
})

jest.mock("@ahmedelsharkawyhelpers/ticketing-common/build/nats-events/natsClient.js", () => {
  return {
    client: {
      publish: jest.fn().mockImplementation((subject: string, data: any, callback: () => void) => {
        callback()
      }),
    },
  }
})

global.login = (id?: string) => {
  const payload = { email: "test@example.com", id: id || Date.now().toString() }
  const jwt = JWT.sign(payload, process.env.JWT_SECRET_KEY)
  const session = { jwt }
  const sessionJson = JSON.stringify(session)
  const base64 = Buffer.from(sessionJson).toString("base64")
  return [`express:sess=${base64}`]
}
