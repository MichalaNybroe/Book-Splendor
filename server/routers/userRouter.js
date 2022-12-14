import { Router } from "express"
const router = Router()

import db from "../database/connection.js"

function adminGuard(req, res, next) {
    if (req.session.IsLoggedIn !== true) {
        return res.status(401).send({ message: "Not logged in."})
    }

    if (req.session.userRole !== "admin") {
        return res.status(401).send({ message: "Not authorized."})
    }
    next()
}

router.get("/api/users", adminGuard, async (req, res) => {
    const users = await db.query("SELECT * FROM users;")
    if (users === undefined) {
        res.status(400).send({ data: undefined, message: `Unable to retrieve users`})
    } else {
        res.send({ data: users})
    }
})


export default router