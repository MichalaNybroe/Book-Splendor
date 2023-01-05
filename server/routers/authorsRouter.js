import { Router } from "express"
import { adminGuard, loggedinGuard } from "../util/guard.js"
import db from "../database/connection.js"

const router = Router()
router.use(loggedinGuard)

router.get("/api/authors", adminGuard, async (req, res) => {
    const [authors,_] = await db.query("SELECT * FROM authors ORDER BY name ASC;")
    if (!authors) {
        res.status(400).send({ data: undefined, message: "Unable to retrieve authors."})
    } else {
        res.send({ data: authors})
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