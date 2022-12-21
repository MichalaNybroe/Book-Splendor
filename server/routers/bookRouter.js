import { Router } from "express"
const router = Router()
import { adminGuard, loggedinGuard } from "../util/guard.js"

import db from "../database/connection.js"

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

//create book

//for dropdown options // har lavet routers til hver
/*router.get("/api/books"), adminGuard, async (req, res) => {
    const authorlist = await db.query("SELECT * FROM authors ORDER BY name ASC;")
    const serieslist = await db.query("SELECT * FROM series ORDER BY name ASC;")
    const genreslist = await db.query("SELECT * FROM genreslist ORDER BY name ASC;")

    res.send({ data: authorlist, serieslist, genreslist })
    
}*/

router.post("/api/books", loggedinGuard, adminGuard, async (req, res) => {
    const { title, description, number, series_id, unreleased, img, authors, genres} = req.body
    checkBookInput(title, description, number, series_id, unreleased, img, authors, genres)

    const [bookRes, _] = await db.query("INSERT INTO books(title, description, number, unreleased, img, series_id) VALUE(?, ?, ?, ?, ?, ?);", [title, description, number, unreleased, img, series_id])
    if (bookRes == undefined) {
        return res.status(404).send("Unable to create book")
    }
    authors.forEach(author => {
        db.query("INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);", [bookRes.id, author])
    })

    genres.forEach(genre => {
        db.query("INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);", [bookRes.id, genre])
    })

    res.send({ affectedRows: bookRes.affectedRows, message: "Book created." })
})

router.put("/api/books/:id", loggedinGuard, adminGuard, async (req, res) => {
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

router.delete("/api/books/:id", loggedinGuard, adminGuard, async (req, res) => {
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