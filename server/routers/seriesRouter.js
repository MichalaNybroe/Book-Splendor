import { Router } from "express"
import { adminGuard } from "../util/guard.js"
import db from "../database/connection.js"
import { setBooks } from "../util/setBooks.js"

const router = Router()

router.get("/api/series", adminGuard, async (req, res) => {
    try {
        const [series,_] = await db.query("SELECT * FROM series ORDER BY title ASC;")
        if (!series) {
            res.status(400).send({ data: undefined, message: "Unable to retrieve series."})
        } else {
            res.send({ data: series })
        }
    } catch {
        res.status(500).send("Server error.")
    }
    
})

router.get("/api/series/:id", async (req, res) => {
    try {
        const [series,_] = await db.query(
            `SELECT 
                books.*, 
                series_id,
                series.title AS series_title,
                authors_id, 
            authors.name AS author_name
            FROM books
                LEFT JOIN series ON series.id = books.series_id
                LEFT JOIN books_authors ON books.id = books_authors.books_id 
                LEFT JOIN authors ON books_authors.authors_id = authors.id
            WHERE series.id=?;`, [req.params.id]
        )
        if (!series) {
            res.status(400).send({ data: undefined, message: "Unable to retrieve series."})
        } else {
            res.send({ data: setBooks(series) })
        }
    }
    catch {
        res.status(500).send({ message : "Server error." })
    }
})

router.post("/api/series", adminGuard, async (req, res) => {
    try {
        const { title } = req.body

        if (!title) return res.status(400).send({ message: "Series title is undefined." })
    
        const [serieRes, _] = await db.query("INSERT INTO series(title) VALUE(?);", [title])
        if (!serieRes) {
            return res.status(404).send("Unable to create series.")
        }
        res.send({ affectedRows: serieRes.affectedRows, message: "Series created." })
    } catch {
        res.status(500).send("Server error.")
    } 
})

export default router