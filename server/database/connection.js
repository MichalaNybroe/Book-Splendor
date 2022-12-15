import mysql from "mysql2/promise"
import * as dotenv from "dotenv"
dotenv.config()

const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: "book_splendor"
})

export default connection
