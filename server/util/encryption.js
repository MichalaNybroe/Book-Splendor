import bcrypt from "bcrypt"

const saltRounds = 14

export function encryptPassword(password) {
    return bcrypt.hash(password, saltRounds)
}

export function comparePassword(password, userPassword) {
    return bcrypt.compare(password, userPassword)
}