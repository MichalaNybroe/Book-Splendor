
import { Router } from "express"
const router = Router()
import { adminGuard, loggedinGuard } from "../util/guard.js"
import db from "../database/connection.js"
import { setBooks } from "../util/setBooks.js"

// save book of the week id
router.put("/api/books/:id", loggedinGuard, adminGuard, checkBookInput, async (req, res) => {
    const { recommended } = req.body

    const [book, _] = await db.query("UPDATE books SET recommended = ? WHERE id=?;", [recommended, req.params.id])
    if(!book) {
        return res.status(400).send({ message: "Book not be found." })
    }
    res.send({ affectedRows: book.affectedRows})
})


router.get("/api/books", async (req, res) => {
    const [books,_] = await db.query(
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
    
    const cleanedBooks = setBooks(books)

    if (books === undefined) {
        res.status(400).send({ data: undefined, message: `No books` })
    } else {
        res.send({ data: cleanedBooks })
    }
})

router.get("/api/books/:id", async (req, res) => {
    const [books,_] = await db.query(
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
        WHERE books.id=?;`, [req.params.id]
    )
        
    const cleanedbooks= setBooks(books)

    if (!books) {
        res.status(400).send({ data: undefined, message: `No book by ${req.params.id} id`})
    } else {
        res.send({ data: cleanedbooks[0] })
    }
})

router.post("/api/books", loggedinGuard, adminGuard, checkBookInput, async (req, res) => {
    const { title, description, number, series, unreleased, img, authors, genres} = req.body

    const [bookRes, _] = await db.query("INSERT INTO books(title, description, number, unreleased, img, series_id) VALUE(?, ?, ?, ?, ?, ?);", [title, description, number, unreleased, img, series?.id])
 
    if (bookRes == undefined) {
        return res.status(404).send("Unable to create book.")
    }
    authors.forEach(author => {
        db.query("INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);", [bookRes.insertId, author.id])
    })

    genres.forEach(genre => {
        db.query("INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);", [bookRes.insertId, genre.id])
    })

    res.send({ affectedRows: bookRes.affectedRows, message: "Book created." })
})

router.put("/api/books/:id", loggedinGuard, adminGuard, checkBookInput, async (req, res) => {
    const { title, description, number, series, unreleased, img, authors, genres} = req.body

    const [book, _] = await db.query("UPDATE books SET title = ?, description = ?, number = ?, series_id = ?, unreleased = ?, img = ? WHERE id=?;", [title, description, number, series?.id, unreleased, img, req.params.id])
    if(!book) {
        return res.status(400).send({ message: "No book with this is." })
    }

    await db.query("DELETE FROM books_authors WHERE books_id=?;", [req.params.id])
    authors.forEach(async author => {
        await db.query("INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);", [req.params.id, author.id])
    })

    await db.query("DELETE FROM books_genres WHERE books_id=?;", [req.params.id])
    genres.forEach(async genre => {
        await db.query("INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);", [req.params.id, genre.id])
    })

    res.send({ affectedRows: book.affectedRows})
})

router.delete("/api/books/:id", loggedinGuard, adminGuard, async (req, res) => {
    const result = await db.query("DELETE FROM books WHERE books.id=?;", [req.params.id])
    if (result === undefined) {
      res.status(404).send({ data: undefined, message: `No book with ${req.params.id} id`})
    } else {
        res.send({ data: result })
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