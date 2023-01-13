import { Router } from "express"
import { adminGuard, loggedinGuard } from "../util/guard.js"
import db from "../database/connection.js"
import { setBooks } from "../util/setBooks.js"

const router = Router()

router.get("/api/books?", async (req, res) => {
    let bookList = ''
    try {
        if(!req.query.title) {
            const [books, _] = await db.query(
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
                    LEFT JOIN series ON series.id = books.series_id;`
            )
            bookList = books
        } else {
            const [books, _] = await db.query (
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
                WHERE books.title LIKE ?
                OR series.title LIKE ?;`, ["%" + req.query.title + "%", "%" + req.query.title + "%"]
            )
            bookList = books
        }

        const cleanedBooks = setBooks(bookList)
        res.send({ data: cleanedBooks })
    } catch {
        res.status(400).send({ data: undefined, message: "No books found." })
    }
})

// get books of the week
router.get("/api/books/recommendations", async (req, res) => {
    try {
        const [books, _] = await db.query(
            `SELECT
                books.*,
                authors_id, 
                authors.name AS author_name,
                genres_id,
                genres.name AS genre_name,
                series_id,
                series.title AS series_title,
                reviews.id AS review_id,
                reviews.rating AS review_rating,
                (SELECT AVG(reviews.rating) FROM reviews WHERE reviews.books_id = books.id) AS average_rating
            FROM books
                LEFT JOIN books_authors ON books.id = books_authors.books_id 
                LEFT JOIN authors ON books_authors.authors_id = authors.id
                LEFT JOIN books_genres ON books.id = books_genres.books_id
                LEFT JOIN genres ON books_genres.genres_id = genres.id
                LEFT JOIN series ON series.id = books.series_id
                LEFT JOIN reviews ON reviews.books_id = books.id
            WHERE books.recommended=1;`
        )
            
        const cleanedbooks= setBooks(books)
        res.send({ data: cleanedbooks })
    } catch {
        res.status(500).send({ data: undefined, message: "Could not recommend book."})
    }
})

router.get("/api/books/:id", async (req, res) => {
    try {
        const [books, _] = await db.query(
            `SELECT 
                books.*, 
                authors_id, 
                authors.name AS author_name,
                genres_id,
                genres.name AS genre_name,
                series_id,
                series.title AS series_title,
                reviews.id AS review_id,
                reviews.subject AS review_subject,
                reviews.text AS review_text,
                reviews.rating AS review_rating,
                users.user_name AS review_user_name,
                users.picture_number AS review_user_picture,
                (SELECT AVG(reviews.rating) FROM reviews WHERE reviews.books_id = books.id) AS average_rating
            FROM books
                LEFT JOIN books_authors ON books.id = books_authors.books_id 
                LEFT JOIN authors ON books_authors.authors_id = authors.id
                LEFT JOIN books_genres ON books.id = books_genres.books_id
                LEFT JOIN genres ON books_genres.genres_id = genres.id
                LEFT JOIN series ON series.id = books.series_id
                LEFT JOIN reviews ON reviews.books_id = books.id
                LEFT JOIN users ON users.id = reviews.users_id
            WHERE books.id=?;`, [req.params.id]
        )
            
        const cleanedbooks= setBooks(books)
        res.send({ data: cleanedbooks })
    } catch {
        res.status(404).send({ data: undefined, message: `No book by ${req.params.id} id`})
    }
})

router.post("/api/books", loggedinGuard, adminGuard, checkBookInput, async (req, res) => {
    try {
        const { title, description, number, series, unreleased, img, authors, genres} = req.body

        const [bookRes, _] = await db.query("INSERT INTO books(title, description, number, unreleased, img, series_id) VALUE(?, ?, ?, ?, ?, ?);", [title, description, number, unreleased, img, series?.id])
        
        authors.forEach(author => {
            db.query("INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);", [bookRes.insertId, author.id])
        })
    
        genres.forEach(genre => {
            db.query("INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);", [bookRes.insertId, genre.id])
        })
    
        res.send({ affectedRows: bookRes.affectedRows, message: "Book created." })
    } catch {
        return res.status(500).send("Unable to create book.")
    }
})

router.put("/api/books/:id", loggedinGuard, adminGuard, checkBookInput, async (req, res) => {
    try {
        const { title, description, number, series, unreleased, img, authors, genres} = req.body

        const [bookRes, _] = await db.query("UPDATE books SET title = ?, description = ?, number = ?, series_id = ?, unreleased = ?, img = ? WHERE id=?;", [title, description, number, series?.id, unreleased, img, req.params.id])
    
        await db.query("DELETE FROM books_authors WHERE books_id=?;", [req.params.id])
        authors.forEach(async author => {
            await db.query("INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);", [req.params.id, author.id])
        })
    
        await db.query("DELETE FROM books_genres WHERE books_id=?;", [req.params.id])
        genres.forEach(async genre => {
            await db.query("INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);", [req.params.id, genre.id])
        })
    
        res.send({ affectedRows: bookRes.affectedRows})
    } catch {
        return res.status(404).send({ message: "No book with this id." })
    }
})

// save book of the week id
router.patch("/api/books/:id", loggedinGuard, adminGuard, async (req, res) => {
    try {
        const { recommended } = req.body

        const [book, _] = await db.query("UPDATE books SET recommended = ? WHERE id=?;", [recommended, req.params.id])
        if(!book) {
            return res.status(404).send({ message: "Book not found." })
        }
        res.send({ affectedRows: book.affectedRows })
    } catch {
        res.status(500).send("Book could not be recommended.")
    }
   
})

router.delete("/api/books/:id", loggedinGuard, adminGuard, async (req, res) => {
    try {
        const result = await db.query("DELETE FROM books WHERE books.id=?;", [req.params.id])
        if (result === undefined) {
          res.status(404).send({ data: undefined, message: `No book with ${req.params.id} id`})
        } else {
            res.send({ data: result })
        }
    } catch {
        res.status(500).send("Book unsuccesfully deleted.")
    }

})



function checkBookInput(req, res, next) {
    if (!req.body.title) return res.status(400).send({ message: "Book title is undefined." })
    if (!req.body.description) return res.status(400).send({ message: "Description is undefined." })
    if (!req.body.number) return res.status(400).send({ message: "Number is undefined." })
    if (!req.body.series?.id && req.body.series !== null) return res.status(400).send({ message: "Series is undefined." })
    if (!("unreleased" in req.body)) return res.status(400).send({ message: "Unreleased is undefined." })
    if (!req.body.img) return res.status(400).send({ message: "Image of Book is undefined." })
    if (!req.body.authors) return res.status(400).send({ message: "Authors is undefined." })
    if (!req.body.genres) return res.status(400).send({ message: "Genres is undefined." })

    next()
}

export default router