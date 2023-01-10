import { Router } from "express"
import { adminGuard, loggedinGuard } from "../util/guard.js"
import db from "../database/connection.js"

const router = Router()
router.use(loggedinGuard)

router.get("/api/series", adminGuard, async (req, res) => {
    const [series,_] = await db.query("SELECT * FROM series ORDER BY title ASC;")
    if (series === undefined) {
        res.status(400).send({ data: undefined, message: "Unable to retrieve series."})
    } else {
        res.send({ data: series })
    }
})

router.get("/api/series/id", adminGuard, async (req, res) => {
    try {
        const [series,_] = await db.query(
            `SELECT 
                books.*, 
                series_id,
                series.title AS series_title
            FROM books
                LEFT JOIN series ON series.id = books.series_id
            WHERE series.id=?;`, [req.params.id]
        )
        if (series === undefined) {
            res.status(400).send({ data: undefined, message: "Unable to retrieve series."})
        } else {
            res.send({ data: series})
        }
    }
    catch {
        res.status(500).send({ message : "Server error." })
    }
})

router.post("/api/series", adminGuard, async (req, res) => {
    const { title } = req.body

    if (!title) return res.status(400).send({ message: "Series title is undefined." })

    const [serieRes, _] = await db.query("INSERT INTO series(title) VALUE(?);", [title])
    if (serieRes === undefined) {
        return res.status(404).send("Unable to create series.")
    }
    res.send({ affectedRows: serieRes.affectedRows, message: "Series created." })
})

export default router