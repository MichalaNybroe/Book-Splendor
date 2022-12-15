import { Router } from "express"
const router = Router()

import db from "../database/connection.js"

function adminGuard(req, res, next) {
    if (req.session.IsLoggedIn !== true) {
        return res.status(401).send({ message: "Not logged in."})
    }

    if (req.session.userRole !== "admin") {
        return res.status(401).send({ message: "Not authorized."})
    }
    next()
}

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
    const { title, description } = req.body //author, series, genre 
    //on series || ""

    //if statements with status 400 on attributes that need to be filled out
    //const result = await db.query(`INSERT INTO books(x, x) VALUES(?,?);`, [x x x])
    //res.send({ changes: result.changes })
})

router.put("/api/books/:id", adminGuard, (req, res) => {
    // similar to post
})

router.delete("/api/books/:id", adminGuard, async (req, res) => {
    const result = await db.query("DELETE FROM books WHERE books.id=?;", [req.params.id])
    if (result === undefined) {
      res.status(404).send({ data: undefined, message: `No book with ${req.params.id} id`})
    } else {
        res.send({ data: result })
    }
})

export default router