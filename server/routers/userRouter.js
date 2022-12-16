import { Router } from "express"
const router = Router()

import db from "../database/connection.js"

function adminGuard(req, res, next) {
    if (req.session.IsLoggedIn !== true) {
        return res.status(401).send({ message: "Not logged in."})
    }

    if (req.session.admin !== true) {
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

//enable change of  username


//enable deletion of own user

router.delete("/api/users/:id", adminGuard, async (req, res) => {
    const result = await db.query("DELETE FROM users WHERE users.id=?;", [req.params.id])
    if (result === undefined) {
      res.status(404).send({ data: undefined, message: `No book with ${req.params.id} id`})
    } else {
        res.send({ data: result })
    }
})


export default router