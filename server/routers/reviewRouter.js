import { Router } from "express"
import { adminGuard, loggedinGuard } from "../util/guard.js"
import db from "../database/connection.js"

const router = Router()

router.use(loggedinGuard)

router.get("/api/reviews", adminGuard, async (req, res) => {
    try {
        const [reviews, _] = await db.query('SELECT * FROM reviews;')
        res.send({ data: reviews })
    } catch {
        res.status(404).send({ data: undefined, message: "Unable to retrieve reviews." })
    }
})

router.post("/api/reviews", async (req, res) => {
    if (req.session?.admin !== true) {
        try {
            const [reviewCheck] = await db.query("SELECT * FROM reviews WHERE reviews.users_id=? AND reviews.books_id=?", [req.session.userid, req.body.bookId])
            if (reviewCheck.length === 0) {
                const { subject, review, rating, bookId, userId } = req.body
    
                const [reviewRes, _] = await db.query("INSERT INTO reviews(subject, text, rating, books_id, users_id) VALUE(?, ?, ?, ?, ?);", [subject, review, rating, bookId, userId])
                res.send({ affectedRows: reviewRes.affectedRows, message: "Review created." })

                const [reviews] = await db.query(
                    `SELECT
                        reviews.*,
                        users.user_name AS username,
                        users.picture_number AS user_picture
                    FROM reviews
                        JOIN users ON users.id = reviews.users_id
                    WHERE reviews.id=?;`, [reviewRes.insertId])

                const io = req.app.get('io')
                io.emit(`Books.${bookId}`, reviews[0])
                return
            }

            res.status(400).send({ message: "You may only leave one review pr book." })
        } catch {
            return res.status(400).send("Unable to create review.")
        }
    } else {
        return res.status(401).send("Unauthorized to create review.")
    }
})

router.put("/api/reviews/:id", async (req, res) => {
    try {
        const { subject, text, rating } = req.body

        if (req.session.admin !== true) {
        const [reviewRes, _] = await db.query("UPDATE reviews SET subject = ?, text = ?, rating = ? WHERE id=? AND users_id=?;", [subject, text, rating, req.params.id, req.session.userId])
    
        res.send({ affectedRows: reviewRes.affectedRows})
        return
        }

        res.status(401).send({ message: "Unauthorized to update this review"})
    } catch {
        return res.status(500).send({ message: "Unsucessfull update of review." })
    }
})

router.delete("/api/reviews/:id", async (req, res) => {
    try {
        if (req.session.admin !== true) {
            const [result] = await db.query("DELETE FROM reviews WHERE reviews.id=? AND reviews.users_id=?;", [req.params.id, req.session.userid])
            res.send({ data: result })
        } else {
            const [result] = await db.query("DELETE FROM reviews WHERE reviews.id=?;", [req.params.id])
            res.send({ data: result })
        }
        
    } catch {
        res.status(404).send({ data: undefined, message: "Unsucessfull deletetion of review."})
    }
})


export default router
