import { Router } from "express"
import { adminGuard, loggedinGuard, userGuard } from "../util/guard.js"
import db from "../database/connection.js"

const router = Router()

router.use(loggedinGuard)

// user hent egne, opret, opdater og slet

router.get("/api/reviews", adminGuard, async (req, res) => {
    try {
        const [reviews, _] = await db.query('SELECT * FROM reviews;')
        res.send({ data: reviews })
    } catch {
        res.status(404).send({ data: undefined, message: "Unable to retrieve reviews." })
    }
})

router.post("/api/reviews", async (req, res) => {
    if (req.sesssion?.admin !== true) {
        try {
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

        const [reviewRes, _] = await db.query("UPDATE reviews SET subject = ?, text = ?, rating = ? WHERE id=? AND users_id=?;", [subject, text, rating, req.params.id, req.session.userId])
    
        res.send({ affectedRows: reviewRes.affectedRows})
    } catch {
        return res.status(500).send({ message: "Unsucessfull update of review." })
    }
})

router.delete("/api/reviews/:id", adminGuard, async (req, res) => {
    try {
        const result = await db.query("DELETE FROM reviews WHERE reviews.id=?;", [req.params.id])
        res.send({ data: result })
    } catch {
        res.status(404).send({ data: undefined, message: `No review with ${req.params.id} id`})
    }
})


export default router
