import { Router } from "express"
const router = Router()

import db from "../database/connection.js"
import { comparePassword, encryptPassword } from "../util/encryption.js"
import { sendMail } from "../util/mail.js"

import rateLimit from "express-rate-limit"
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 6
})
router.use(limiter)

function checkPasswordSecurity(req, res, next) {
    const { password, passwordRepeat } = req.body
    if (password !== passwordRepeat) {
        res.status(400).send({ message: "Passwords do not match."})
    }

    if (password.length < 9) {
        res.status(400).send({ message: "Password needs to be 8 or more characters long." })
    }
    next()
}

router.post("/login", async (req, res) => {
    const { email, password } = req.body

    const [rows, fields] = await db.query("SELECT * FROM users WHERE email=?;", [email])
    const user = rows[0]

    if (!user || await !comparePassword(password, user.password)) {
        return res.status(401).send({ message: "Login failed." })
    } else {
        //do we want this?
        req.session.isLoggedIn = true
        req.session.admin = !!user.admin //cast twice for bool
        res.status(200).send({ data: {email: user.email, user_name: user.user_name, admin: !!user.admin, picture_number: user.picture_number, color: user.color}, message: "Login successful" })
    }
})


router.post("/logout", (req, res) => {
    req.session.destroy() //tjek at session.isLoggedIn bliver false
    res.send({ message: "Logged out." })
})

router.post("/forgotPassword",  (req, res) => {
    const email = req.body.email
    const link = "www.ja/updatePassword.ja" // hvad skal dette link være // hash værdi

    sendMail(email, "Password reset", `Please follow link to reset password. ${link}`)
    .then(() => res.send( { message: "An email has been sent to reset password." }))
    .catch(() => res.status(400).send( { data: undefined, message: "Unsuccessful." } ));
})

router.post("/updatePassword",checkPasswordSecurity, (req, res) => {
    // how do we check link security?
    const { email, password } = req.body

    db.query("UPDATE users SET(password=?) WHERE email=(?);", [password, email])
    res.status(200).send({ message: "Password Updated." })
})


router.post("/signUp", checkPasswordSecurity, (req, res) => {
    const { username, email, password } = req.body

    db.query("INSERT INTO users(user_name, email, password, admin) VALUES(?,?,?,?);", [username, email, encryptPassword(password), false])
    req.session.isLoggedIn = true
    req.session.email = email
    req.session.role = "user"
    res.status(200).send({ message: "Successfull signup." })
})

export default router
