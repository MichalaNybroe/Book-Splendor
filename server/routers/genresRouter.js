import { Router } from "express"
import { adminGuard, loggedinGuard } from "../util/guard.js"
import db from "../database/connection.js"

const router = Router()
router.use(loggedinGuard)

router.get("/api/genres", adminGuard, async (req, res) => {
    const [genres,_] = await db.query("SELECT * FROM genres ORDER BY name ASC;")
    if (genres === undefined) {
        res.status(400).send({ data: undefined, message: "Unable to retrieve genres."})
    } else {
        res.send({ data: genres})
    }
})

router.get("/api/genres/id", adminGuard, async (req, res) => {
    const [genresReq,_] = await db.query(
        `SELECT 
        books.*, 
        genres_id, 
        genres.name AS genre_name
    FROM books
        LEFT JOIN books_genres ON books.id = books_genres.books_id
        LEFT JOIN genres ON books_genres.genres_id = genres.id
    WHERE genres.id=?;`, [req.params.id]
    )
    if (genresReq === undefined) {
        res.status(400).send({ data: undefined, message: "Unable to retrieve books in this genre."})
    } else {
        res.send({ data: genresReq})
    }
})

router.post("/api/genres", adminGuard, async (req, res) => {
    const { name } = req.body

    if (!name) return res.status(400).send({ message: "Genre name is undefined." })

    const [genreRes, _] = await db.query("INSERT INTO genres(name) VALUE(?);", [name])
    if (genreRes === undefined) {
        return res.status(404).send("Unable to create genre.")
    }
    res.send({ affectedRows: genreRes.affectedRows, message: "Genre created." })
})

export default router