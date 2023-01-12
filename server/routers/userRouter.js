import { Router } from "express"
const router = Router()
import { adminGuard, userGuard, loggedinGuard } from "../util/guard.js"

import db from "../database/connection.js"

router.use(loggedinGuard)

router.get("/api/users", adminGuard, async (req, res) => {
    try {
        const [users,_] = await db.query("SELECT * FROM users;")
        const userList = []
        users.forEach((user) => {
            userList.push({id: user.id, email: user.email, user_name: user.user_name})
        })
        res.send({ data: userList})
    } catch {
        res.status(400).send({ data: undefined, message: `Unable to retrieve users`})
    }
})

/*router.get("/api/users/:id/reviews", userGuard, async (req, res) => {
    try {
        const [reviews, _] = await db.query('SELECT * FROM reviews WHERE users_id=?;', [req.params.id])
        res.send({ data: reviews})
    } catch {
        res.status(404).send({ data: undefined, message: "Unable to retrieve reviews." })
    }
})*/

router.patch("/api/users/:id", userGuard, async (req, res) => {
    // Tilføj response for hver hvis det virker og for hver hvis det mislykkes
    if (req.body.user_name) {
        try {
            await db.query("UPDATE users SET user_name = ? WHERE id=?;", [req.body.user_name, req.session.userid])
            res.send({ message: 'Username has been successfully updated.' })
        } catch {
            res.status(500).send({ message: 'Unable to update username.' })
        }
    } else if (req.body.color) {
        try {
            await db.query("UPDATE users SET color = ? WHERE id=?;", [req.body.color, req.session.userid])
            res.send("Color updated.")
        } catch {
            res.status(500).send({ message: 'Unable to update users color.' })
        }
        
    } else if (req.body.picture_number) {
        try {
            await db.query("UPDATE users SET picture_number = ? WHERE id=?;", [req.body.picture_number, req.session.userid])
            res.send({ message: 'Profile picture updated.' })
        } catch {
            res.status(500).send({ message: 'Unable to update profile picture.' })
        }
    }
})

router.delete("/api/users/:id", async (req, res, next) => {
    if (req.session.userid === Number(req.params.id)) {
        try {
            const result = await db.query("DELETE FROM users WHERE users.id=?;", [req.params.id])
            req.session.destroy()
            res.send({ data: result, message: 'User has been removed.'})
        } catch {
            res.status(404).send({ data: undefined, message: `No user with this id`})
        }
    } else {
        if (req.session.admin !== true) {
            return res.status(401).send({ message: "Not authorized." })
        }

        try {
            const result = await db.query("DELETE FROM users WHERE users.id=?;", [req.params.id])
            res.send({ data: result })
        } catch {
            res.status(404).send({ data: undefined, message: `No user with ${req.params.id} id`})
        }
    } 
})

router.delete("/api/users/:userid/reviews/:reviewid", async (req, res) => {
    if (req.session.userid === Number(req.params.userid)) {
        try {
            const result = await db.query("DELETE FROM reviews WHERE users_id=? AND id=?;", [req.params.userid, req.params.reviewid])
            res.send({ data: result })
        } catch {
            res.status(404).send({ data: undefined, message: `No user with ${req.params.id} id`})
        }
    } else {
        return res.status(401).send({ message: "Not authorized." })
    }
})


export default router