import { Router } from "express"
const router = Router()
import { adminGuard, loggedinGuard } from "../util/guard.js"

import db from "../database/connection.js"

// save book of the week id

router.get("/api/books", async (req, res) => {
    const [books,_] = await db.query("SELECT books.*, authors_id, authors.name AS author_name FROM books JOIN books_authors ON books.id = books_authors.books_id JOIN authors ON books_authors.authors_id = authors.id;")
    const booksAuthors = {}
    
    books.forEach((book) => {
        if(!(book.id in booksAuthors)) {
            booksAuthors[book.id] = book
            booksAuthors[book.id]["authors"] = []
        }
        booksAuthors[book.id]["authors"].push({
            name: book.author_name,
            id: book.authors_id
        })
    })

    if (books === undefined) {
        res.status(400).send({ data: undefined, message: `No books`})
    } else {
        res.send({ data: Object.values(booksAuthors) }) //cast object to array
    }
})

router.get("/api/books/:id", async (req, res) => {
    const book = await db.query("SELECT * FROM books WHERE books.id=?;", [req.params.id])
    if (book === undefined) {
        res.status(400).send({ data: undefined, message: `No book by ${req.params.id} id`})
    } else {
        res.send({ data: book })
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

    const [book, _] = await db.query("UPDATE books SET (title = ?, description = ?, number = ?, series_id = ?, unreleased = ?, img = ?) WHERE id=?;", [title, description, number, series.id, unreleased, img, req.params.id])
    if(!book) {
        return res.status(400).send({ message: "No book with this is." })
    }

    db.query("DELETE FROM books_authors WHERE books_id=?;" [req.params.id])
    authors.forEach(author => {
        db.query("INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);", [bookRes.id, author])
    })

    db.query("DELETE FROM books_genres WHERE books_id=?;", [req.params.id])
    genres.forEach(genre => {
        db.query("INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);", [bookRes.id, genre])
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