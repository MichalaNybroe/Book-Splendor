import bcrypt from "bcrypt"

const saltRounds = 14

export async function encryptPassword(password) {
    const b = await bcrypt.hash(password, saltRounds)
    return b
}

export function comparePassword(password, userPassword) {
    return bcrypt.compare(password, userPassword)
}