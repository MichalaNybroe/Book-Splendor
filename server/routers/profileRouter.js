import { Router } from "express"
const router = Router()
import { userGuard, loggedinGuard } from "../util/guard.js"

//socket io 
import { Server } from "socket.io"
const server = http.createServer(app)
const io = new Server(server)

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next)
io.use(wrap(sessionMiddleware))

if (process.env.NODE_ENV === "DEVELOPMENT") {
    chokidar.watch(distFolderPath,
        {
            awaitWriteFinish: {
                stabilityThreshold: 2000
            }
        })
    .on("change", () => io.emit("update the page"))
}

io.on("connection", (socket) => {
    socket.on("client choose a new color", (data) => {
        data.username = socket.request.session.username
        io.emit("update the color", data)
    })
})