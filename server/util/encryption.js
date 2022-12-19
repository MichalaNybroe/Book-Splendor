import bcrypt from "bcrypt"

const saltRounds = 14

export function encryptPassword(password) {
    return bcrypt.hash(password, saltRounds)
}

export async function comparePassword(password, userPassword) {
    const b = await bcrypt.compare(password, userPassword)
    return b
}