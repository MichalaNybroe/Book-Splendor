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

import rateLimit from "express-rate-limit"
/*const superLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100
})
app.use(superLimiter)*/

app.use(express.json())

// Socket
import { createServer } from "http"
import { Server } from "socket.io"

const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: `http://localhost:5173`,
        credentials: true
    }
})
app.set('io', io)

io.on("connection", (socket) => {
})

//Routers
import authRouter from "./routers/authRouter.js"
import bookRouter from "./routers/bookRouter.js"
import contactFormRouter from "./routers/contactFormRouter.js"
import authorsRouter from "./routers/authorsRouter.js"
import genresRouter from "./routers/genresRouter.js"
import seriesRouter from "./routers/seriesRouter.js"
import userRouter from "./routers/userRouter.js"
import reviewRouter from "./routers/reviewRouter.js"
import profileRouter from "./routers/profileRouter.js"
app.use(authRouter)
app.use(bookRouter)
app.use(contactFormRouter)
app.use(authorsRouter)
app.use(genresRouter)
app.use(seriesRouter)
app.use(userRouter)
app.use(reviewRouter)
app.use(profileRouter)


const PORT = Number(process.env.PORT) || 8080
httpServer.listen(PORT)
