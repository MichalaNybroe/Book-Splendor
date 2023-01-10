import { Router } from "express"
import { adminGuard, loggedinGuard } from "../util/guard.js"
import db from "../database/connection.js"

const router = Router()
router.use(loggedinGuard)

router.get("/api/authors/id", adminGuard, async (req, res) => {
    const [authorsBooks,_] = await db.query(
        `SELECT 
        books.*, 
        authors_id, 
        authors.name AS author_name
    FROM books
        LEFT JOIN books_authors ON books.id = books_authors.books_id 
        LEFT JOIN authors ON books_authors.authors_id = authors.id
    WHERE authors.id=?;`, [req.params.id]
    )
    if (!authorsBooks) {
        res.status(400).send({ data: undefined, message: "Unable to retrieve authors' books."})
    } else {
        res.send({ data: authorsBooks})
    }
})

router.post("/api/authors", adminGuard, async (req, res) => {
    const { name } = req.body

    if (!name) return res.status(400).send({ message: "Author name is undefined." })

    const [authorRes, _] = await db.query("INSERT INTO authors(name) VALUE(?);", [name])
    if (authorRes === undefined) {
        return res.status(404).send("Unable to create author.")
    }
    res.send({ affectedRows: authorRes.affectedRows, message: "Author created." })
})


export default router