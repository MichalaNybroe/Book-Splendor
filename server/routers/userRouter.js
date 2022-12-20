import { Router } from "express"
const router = Router()

import db from "../database/connection.js"

function adminGuard(req, res, next) {
    checkLoggedInStatus()

    if (req.session.admin !== true) {
        return res.status(401).send({ message: "Not authorized." })
    }
    next()
}

function userGuard(req, res, next) {
    checkLoggedInStatus()

    if (req.session.id !== req.params.id) {
        return res.status(401).send({ message: "Not authorized." })
    }

    next()
}

function checkLoggedInStatus(req, res, next) {
    if (req.session.IsLoggedIn !==true) {
        return res.status(401).send({ message: "Not signed in. " })
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

router.patch("/api/users/:id"), userGuard, async (req, res) => {
    if (req.body.user_name) {
        db.query("UPDATE users SET user_name = ? WHERE id=?", req.body.user_name, req.session.id)
    } else if (req.body.color) {
        db.query("UPDATE users SET color = ? WHERE id=?", req.body.color, req.session.id)
    } else if (req.body.picture_number) {
        db.query("UPDATE users SET picture_number = ? WHERE id=?", req.body.picture_number, req.session.id)
    }
}

router.delete("/api/users/:id", checkLoggedInStatus, async (req, res) => {
    if (req.session.id === req.params.id) {
        const result = await db.query("DELETE FROM users WHERE users.id=?;", [req.params.id])
        
        if (result === undefined) {
          res.status(404).send({ data: undefined, message: `No user with this id`})
        } else {
            res.send({ data: result })
        }
    } else {
        adminGuard()
        const result = await db.query("DELETE FROM users WHERE users.id=?;", [req.params.id])
        
        if (result === undefined) {
          res.status(404).send({ data: undefined, message: `No user with ${req.params.id} id`})
        } else {
            res.send({ data: result })
        }
    } 
})


export default router