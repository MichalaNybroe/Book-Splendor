import { Router } from "express"
const router = Router()


//import db from "../database/connection.js"

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
    //const books = await db.all("SELECT * FROM books;")
    //res.send({ data: books })
})

router.get("/api/books/:id", async (req, res) => {
    //const book = await db.get("SELECT * FROM books WHERE id=?;", [req.params.id])
    //res.send({ data: book })
})

router.post("/api/books", adminGuard, async (req, res) => {
    const { title, description } = req.body //author, series, genre 
    //on series || ""

    //if statements with status 400 on attributes that need to be filled out
    //const result = await db.run(`INSERT INTO books(x, x) VALUES(?,?);`, [x x x])
    //res.send({ changes: result.changes })
})

router.update("/api/books/:id", adminGuard, (req, res) => {
    // similar to post
})

router.delete("/api/books/:id", adminGuard, (req, res) => {
    //const result = await db.run("")
})

export default router