import { Router } from "express"
import { adminGuard, loggedinGuard } from "../util/guard.js"
import db from "../database/connection.js"

const router = Router()
router.use(loggedinGuard)

router.get("/api/series", adminGuard, async (req, res) => {
    const series = await db.query("SELECT * FROM series ORDER BY name ASC;")
    if (series === undefined) {
        res.status(400).send({ data: undefined, message: "Unable to retrieve series."})
    } else {
        res.send({ data: series})
    }
})

router.post("/api/series", adminGuard, async (req, res) => {
    const { title } = req.body

    if (!title) return res.status(400).send({ message: "Series title is undefined." })

    const [serieRes, _] = await db.query("INSERT INTO series(title) VALUE(?);", [title])
    if (serieRes === undefined) {
        return res.status(404).send("Unable to create series.")
    }
    res.send({ affectedRows: serieRes.affectedRows, message: "Series created." })
})

export default router