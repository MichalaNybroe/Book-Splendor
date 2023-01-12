import { Router } from "express"
const router = Router()

import { userGuard, loggedinGuard } from "../util/guard.js"
import db from "../database/connection.js"
import { setBooks } from "../util/setBooks.js"

router.get("/api/profile/:id", async (req, res) => {
    try {
        const [ [user] ] = await db.query("SELECT * FROM users WHERE id=?", [req.params.id])
        const [ reviews ] = await db.query("SELECT reviews.*, books.title AS review_book_title FROM reviews JOIN books ON reviews.books_id = books.id WHERE users_id=? LIMIT 5", [req.params.id])
        const [ read ] = await db.query(
            `SELECT books.*,
                authors_id, 
                authors.name AS author_name,
                series_id,
                series.title AS series_title
            FROM books 
                JOIN users_books ON users_books.books_id = books.id 
                LEFT JOIN series ON series.id = books.series_id 
                LEFT JOIN books_authors ON books.id = books_authors.books_id 
                LEFT JOIN authors ON books_authors.authors_id = authors.id 
            WHERE users_id=? AND has_read=1`, [req.params.id]
        )
        const [ wantToRead ] = await db.query(
            `SELECT books.*,
                authors_id, 
                authors.name AS author_name,
                series_id,
                series.title AS series_title
            FROM books 
                JOIN users_books ON users_books.books_id = books.id 
                LEFT JOIN series ON series.id = books.series_id 
                LEFT JOIN books_authors ON books.id = books_authors.books_id 
                LEFT JOIN authors ON books_authors.authors_id = authors.id 
            WHERE users_id=? AND want_to_read=1`, [req.params.id]
        )
        
        user.reviews = reviews
        user.read = setBooks(read)
        user.want_to_read = setBooks(wantToRead)
        res.send({ data: user })
    } catch {
        res.status(500).send({ data: undefined, message: "Failed fetching profile." })
    }
})


export default router
