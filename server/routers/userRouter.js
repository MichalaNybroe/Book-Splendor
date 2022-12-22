import { Router } from "express"
const router = Router()
import { adminGuard, userGuard, loggedinGuard } from "../util/guard.js"

import db from "../database/connection.js"

router.use(loggedinGuard)

router.get("/api/users", adminGuard, async (req, res) => {
    const [users,_] = await db.query("SELECT * FROM users;")
    if (users === undefined) {
        res.status(400).send({ data: undefined, message: `Unable to retrieve users`})
    } else {
        const userList = []
        users.forEach(() => {
            userList.push({id: user.id, email: user.email, user_name: user.user_name})
        })
        console.log(userList)
        res.send({ data: userList})
    }
})

router.patch("/api/users/:id", userGuard, async (req, res) => {
    // Tilføj response for hver hvis det virker og for hver hvis det mislykkes
    if (req.body.user_name) {
        await db.query("UPDATE users SET user_name = ? WHERE id=?;", [req.body.user_name, req.session.userid])
        res.send()
    } else if (req.body.color) {
        await db.query("UPDATE users SET color = ? WHERE id=?;", [req.body.color, req.session.userid])
        res.send("Color updated.")
    } else if (req.body.picture_number) {
        db.query("UPDATE users SET picture_number = ? WHERE id=?;", [req.body.picture_number, req.session.userid])
    }
})

router.delete("/api/users/:id", loggedinGuard, async (req, res) => {
    if (req.session.userid === req.params.id) {
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