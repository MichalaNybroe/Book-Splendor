import { Router } from "express"
const router = Router()

import db from "../database/connection.js"
import { comparePassword, encryptPassword } from "../util/encryption.js"
import { sendMail } from "../util/mail.js"

import rateLimit from "express-rate-limit"
/*const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 6
})
router.use(limiter)*/

function checkPasswordSecurity(req, res, next) {
    const { password, passwordTwo } = req.body
    if (password !== passwordTwo) {
        res.status(400).send({ message: "Passwords do not match."})
    }

    if (password.length < 8) {
        res.status(400).send({ message: "Password needs to be 8 or more characters long." })
    }
    next()
}

router.post("/login", async (req, res) => {
    const { email, password } = req.body

    try {
        const [rows, fields] = await db.query("SELECT * FROM users WHERE email=?;", [email])
        const user = rows[0]

        if (!user || await !comparePassword(password, user.password)) {
            return res.status(401).send({ message: "Login failed." })
        } else {
            req.session.isLoggedIn = true
            req.session.admin = !!user.admin //cast twice for bool
            req.session.userid = user.id
            res.status(200).send({ data: {id: user.id, email: user.email, user_name: user.user_name, admin: !!user.admin, picture_number: user.picture_number, color: user.color}, message: "Login successful" })
        }
    } catch {
        res.status(500).send({message: 'Server error.'})
    }
})


router.post("/logout", (req, res) => {
    req.session.destroy() //tjek at session.isLoggedIn bliver false
    res.send({ message: "Logged out." })
})

router.post("/forgotPassword",  async (req, res) => {
    const email = req.body.email
    const link = "www.ja/updatePassword.ja" // hvad skal dette link være // hash værdi

    try {
        await sendMail(email, email, "Password reset", `Please follow link to reset password. ${link}`)
        res.status(200).send({ message: "An email has been sent to reset password." })
    } catch {
        res.status(400).send({ data: undefined, message: "Unsuccessful." })
    }
})

router.post("/updatePassword", checkPasswordSecurity, (req, res) => {
    // how do we check link security?
    const { email, password } = req.body

    db.query("UPDATE users SET(password=?) WHERE email=(?);", [password, email])
    res.status(200).send({ message: "Password Updated." })
})


router.post("/signUp", checkPasswordSecurity, async (req, res) => {
    const { username, email, password } = req.body

    try {
        const [success,_] = await db.query(`INSERT INTO users(user_name, email, password, admin, picture_number, color)
        VALUES(?,?,?,?,?,?);`, [username, email, await encryptPassword(password), false, 1, "#A3B18A"])
        
        if (!success.affectedRows) {
            res.status(400).send({ message: "Unsucessfull signup." })
        } else {
            res.status(200).send({ message: "Successfull signup." })
        }
    } catch (error){
        return res.status(400).send({ message: "Invalid data."})
    }
})

export default router
