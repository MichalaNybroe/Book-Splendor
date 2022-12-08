import bcrypt from "bcrypt"

const saltRounds = 14

export async function encryptPassword(password) {
    return bcrypt.hash(password, saltRounds)
}

export async function comparePassword(password, userPassword) {
    return await bcrypt.compare(password, userPassword)
}