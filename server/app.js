import * as dotenv from "dotenv"
dotenv.config()

import express from "express"
const app = express()

import helmet from "helmet"
app.use(helmet())

import session from "express-session"
app.use(session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false /*http*/}
}))

app.use(express.json())

//Routers
import loginRouter from "./routers/loginRouter.js"
import bookRouter from "./routers/bookRouter.js"
app.use(loginRouter)
app.use(bookRouter)

const PORT = Number(process.env.PORT) || 8080
app.listen(PORT, console.log("Server is running on port ", PORT))