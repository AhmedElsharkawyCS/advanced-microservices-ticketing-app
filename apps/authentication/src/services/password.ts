import { scrypt, randomBytes } from "crypto"
import { promisify } from "util"
export class Password {
  static async toHash(text: string) {
    const salt = randomBytes(8).toString("hex")
    const buffer = (await promisify(scrypt)(text, salt, 64)) as Buffer
    return `${buffer.toString("hex")}.${salt}`
  }
  static async compare(storedPassword: string, text: string) {
    const [hashedPassword, salt] = storedPassword.split(".")
    const buffer = (await promisify(scrypt)(text, salt, 64)) as Buffer
    return buffer.toString("hex") === hashedPassword
  }
}
