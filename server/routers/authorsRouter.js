import { Router } from "express"
import { adminGuard, loggedinGuard } from "../util/guard.js"
import db from "../database/connection.js"
import { setBooks } from "../util/setBooks.js"

const router = Router()

router.get("/api/authors", adminGuard, async (req, res) => {
    try {
        const [authors,_] = await db.query("SELECT * FROM authors ORDER BY name ASC;")
        res.send({ data: authors })
    } catch {
        res.status(400).send({ data: undefined, message: "Unable to retrieve authors."})
    }
})

//SEARCH BOOKS BY AUTHOR NAME
router.get("/api/authors/:name", async (req, res) => {
    try {
        const books = await db.query (
        `SELECT 
            books.*, 
            authors_id, 
            authors.name AS author_name,
            genres_id,
            genres.name AS genre_name,
            series_id,
            series.title AS series_title
        FROM books
            LEFT JOIN books_authors ON books.id = books_authors.books_id 
            LEFT JOIN authors ON books_authors.authors_id = authors.id
            LEFT JOIN books_genres ON books.id = books_genres.books_id
            LEFT JOIN genres ON books_genres.genres_id = genres.id
            LEFT JOIN series ON series.id = books.series_id
        WHERE authors.name LIKE '%${req.params.name}%'`
        )
        const cleanedBooks = setBooks(books)
        res.send({ data: cleanedBooks })
    } catch {
        res.status(404).send({ data: undefined, message: "Unable to find books with search criteria." })
    }
}) 

router.get("/api/authors/:id", async (req, res) => {
    try {
        const [authorsBooks,_] = await db.query(
            `SELECT 
                books.*, 
                authors_id, 
                authors.name AS author_name
            FROM books
                LEFT JOIN books_authors ON books.id = books_authors.books_id 
                LEFT JOIN authors ON books_authors.authors_id = authors.id
            WHERE books.id IN (SELECT books_authors.books_id FROM books_authors WHERE books_authors.authors_id = ?);`, [req.params.id]
        )
        if (!authorsBooks) {
            res.status(400).send({ data: undefined, message: "Unable to retrieve authors' books."})
        } else {
            res.send({ data: setBooks(authorsBooks)})
        }
    } catch {
        res.status(500).send({ message: "Server error." })
    }
})

router.post("/api/authors", loggedinGuard, adminGuard, async (req, res) => {
    try {
        const name = req.body.name
        if (!name) return res.status(400).send({ message: "Author name is undefined." })

        const [authorRes, _] = await db.query("INSERT INTO authors(name) VALUE(?);", [name])
        
        res.send({ affectedRows: authorRes.affectedRows, message: "Author created." })
    } catch {
        return res.status(404).send("Unable to create author.")
    }
})


export default router