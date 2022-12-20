import * as dotenv from "dotenv"
dotenv.config()

import express from "express"
const app = express()

import cors from "cors"
app.use(cors({ credentials: true, origin: true }))

import helmet from "helmet"
app.use(helmet())

import session from "express-session"
app.use(session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false /*http*/}
}))

import rateLimit from "express-rate-limit";
const superLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100
});
app.use(superLimiter);

app.use(express.json())

//Routers
import loginRouter from "./routers/loginRouter.js"
import bookRouter from "./routers/bookRouter.js"
import contactFormRouter from "./routers/contactFormRouter.js"
app.use(loginRouter)
app.use(bookRouter)
app.use(contactFormRouter)


const PORT = Number(process.env.PORT) || 8080
app.listen(PORT, console.log("Server is running on port ", PORT))
