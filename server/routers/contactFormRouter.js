import { Router } from "express"
import { sendMail } from "../util/mail.js"
const router = Router()

console.log("we're in contactformrouter")

router.post("/contact", async (req, res) => {
    console.log(req.body.email)
    const {name, email, subject, message} = req.body
    
    sendMail(name, email, subject, message)
    .then(() => res.send( { msg: "Success." }))
    .catch(() => res.status(400).send( { msg: "An error occurred. "}))
})


export default router