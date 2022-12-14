import * as dotenv from "dotenv"
dotenv.config()
import db from "./connection.js"
import { encryptPassword } from "../util/encryption.js"

const isInDeleteMode = true

if (isInDeleteMode) {
    db.execute('DROP TABLE IF EXISTS users;');
    db.execute(`DROP TABLE IF EXISTS books;`);
}

db.execute(`CREATE TABLE IF NOT EXISTS users(
    email PRIMARY KEY,
    password VARCHAR(255),
    role VARCHAR(50)
);`)

//Yeah so what do we want in books ? :D
db.execute(`CREATE TABLE IF NOT EXISTS books(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255)
);`)


if (isInDeleteMode) {
    //create users and books
    db.execute(`INSERT INTO users(email, password, role) 
    VALUES (?, ?, ?);`, [process.env.ADMIN_EMAIL, encryptPassword(process.env.ADMIN_PASSWORD), "admin"])
    db.execute(`INSERT INTO users(email, password, role) 
    VALUES (?, ?, ?);`, [process.env.USER_EMAIL, encryptPassword(process.env.USER_PASSWORD), "user"])
}