import { Router } from "express"
import { sendMail } from "../util/mail.js"
const router = Router()

function checkEmail(req, res, next) {
    const mail = req.body.email
    const regex = new RegExp("[a-z0-9]+@[a-z]+\.[a-z]{2,3}")
    if (regex.test(mail)) {
        next()
    } else {
        res.status(400).send({ message: "Not a valid email." })
    }
}

router.post("/contact", checkEmail, async (req, res) => {
    const {name, email, subject, message} = req.body
    const mail = `Name: ${name} \n Sender: ${email} \n Message: ${message}`
    try {
        sendMail("Book Splendor", "customerService@bookSplendor.dk", subject, mail)
        res.send({ message: "Mail has been forwarded." })  
    } catch {
        res.status(500).send( { message: "Success." })
    }
})


export default router