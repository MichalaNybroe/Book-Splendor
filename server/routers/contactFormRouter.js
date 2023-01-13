import { Router } from "express"
import { sendMail } from "../util/mail.js"
const router = Router()

router.post("/contact", async (req, res) => {
    const {name, email, subject, message} = req.body
    const mail = `Name: ${name} \n Sender: ${email} \n Message: ${message}`
    try {
        sendMail("Book Splendor", "customerService@bookSplendor.dk", subject, mail)
        .then(() => res.send( { message: "Success." }))    
    } catch {
        res.status(400).send( { msg: "An error occurred. "})
    }
})


export default router