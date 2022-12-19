import { Router } from "express"
const router = Router()

import db from "../database/connection.js"

function adminGuard(req, res, next) {
    if (req.session.IsLoggedIn !== true) {
        return res.status(401).send({ message: "Not logged in."})
    }

    if (req.session.admin !== true) {
        return res.status(401).send({ message: "Not authorized."})
    }
    next()
}

// save book of the week id

router.get("/api/books", async (req, res) => {
    const books = await db.query("SELECT * FROM books;")
    if (books === undefined) {
        res.status(400).send({ data: undefined, message: `No books`})
    } else {
        res.send({ data: books })
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

router.post("/api/books", adminGuard, async (req, res) => {
    const { title, description, number, series_id, unreleased, img, authors, genres} = req.body
    checkBookInput(title, description, number, series_id, unreleased, img, authors, genres)

    const [bookRes, _] = await db.query("INSERT INTO books(title, description, number, unreleased, img, series_id) VALUE(?, ?, ?, ?, ?, ?);", [title, description, number, unreleased, img, series_id])
    authors.forEach(author => {
        db.query("INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);", [bookRes.id, author])
    })

    genres.forEach(genre => {
        db.query("INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);", [bookRes.id, genre])
    })

    res.send({ affectedRows: bookRes.affectedRows })
})

router.put("/api/books/:id", adminGuard, async (req, res) => {
    const { title, description, number, series_id, unreleased, img, authors, genres} = req.body
    checkBookInput(title, description, number, series_id, unreleased, img, authors, genres)

    const [book, _] = await db.query("UPDATE books SET (title = ?, description = ?, number = ?, series_id = ?, unreleased = ?, img = ?) WHERE id=?;", [title, description, number, series_id, unreleased, img, req.params.id])
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

router.delete("/api/books/:id", adminGuard, async (req, res) => {
    const result = await db.query("DELETE FROM books WHERE books.id=?;", [req.params.id])
    if (result === undefined) {
      res.status(404).send({ data: undefined, message: `No book with ${req.params.id} id`})
    } else {
        res.send({ data: result })
    }
})



function checkBookInput(title, description, number, series_id, unreleased, img, authors, genres) {

    if (!title) return res.status(400).send({ message: "Book title is undefined." })
    if (!description) return res.status(400).send({ message: "Description is undefined." })
    if (!number) return res.status(400).send({ message: "Number is undefined." })
    if (!series_id) return res.status(400).send({ message: "Series is undefined." })
    if (!unreleased) return res.status(400).send({ message: "Unreleased is undefined." })
    if (!img) return res.status(400).send({ message: "Image of Book is undefined." })
    if (!authors) return res.status(400).send({ message: "Authors is undefined." })
    if (!genres) return res.status(400).send({ message: "Genres is undefined." })

}

export default router