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

function checkEmail(req, res, next) {
    const mail = req.body.email
    const regex = new RegExp("[a-z0-9]+@[a-z]+\.[a-z]{2,3}")
    if (regex.test(mail)) {
        next()
    } else {
        res.status(400).send({ message: "Not a valid email." })
    }
}

router.post("/login", async (req, res) => {
    const { email, password } = req.body

    try {
        const [ [user] ] = await db.query("SELECT * FROM users WHERE email=?;", [email])

        if (!user || await !comparePassword(password, user.password)) {
            return res.status(401).send({ message: "Login failed." })
        } else {
            req.session.isLoggedIn = true
            req.session.admin = !!user.admin
            req.session.userid = user.id

            if (user.admin === true) {
                res.status(200).send({ data: {id: user.id, email: user.email, admin: !!user.admin } })
                return
            }
            res.status(200).send({ data: {id: user.id, email: user.email, user_name: user.user_name, admin: !!user.admin, picture_number: user.picture_number, color: user.color }})
        }
    } catch {
        res.status(500).send({ message: "Server error." })
    }
})


router.post("/logout", (req, res) => {
    try {
        req.session.destroy()
        res.send({ message: "Logged out." })    
    } catch {
        res.status(500).send("Server error")
    }
})

router.post("/forgotPassword",  async (req, res) => {
    const email = req.body.email
    const password = await randomPasswordGenerator()

    try {
        const [user, _] = await db.query("UPDATE users SET password=? WHERE email=?;", [await encryptPassword(password), email])
        if (user.affectedRows === 0) {
            res.send({ message: "An email has been sent with your reset password. If your email is a user." })
            return
        }
        await sendMail(email, email, "Password reset", `Your password has been reset to: ${password}. Please remember to change your password once you login with a secure password.`)
        
        if (!user) {
            return res.status(404).send({ message: "Unable to reset password." }) 
        }
        res.status(200).send({ message: "An email has been sent with your reset password. If your email is a user." })
    } catch {
        res.status(400).send({ data: undefined, message: "Unsuccessful reset of password." })
    }
})

router.post("/updatePassword", checkPasswordSecurity, async (req, res) => {
    const { email, password } = req.body

    try {
        const [user, _] = await db.query("UPDATE users SET password=? WHERE email=?;", [await encryptPassword(password), email])

        if (!user) {
            return res.status(404).send({ message: "Unable to update password." })
        }
        res.status(200).send({ message: "Password Updated." })
    } catch {
        res.status(400).send({ data: undefined, message: "Unsuccessful update of password." })
    }
})


router.post("/signUp", checkEmail, checkPasswordSecurity, async (req, res) => {
    const { username, email, password, acceptData } = req.body

    if (!acceptData) {
        return res.status(400).send({ message: "You must accept the data treatment to continue" })
    } else { 
    try {
        const [success,_] = await db.query(`INSERT INTO users(user_name, email, password, admin, picture_number, color)
        VALUES(?,?,?,?,?,?);`, [username, email, await encryptPassword(password), false, 1, "#A3B18A"])
        
        if (!success.affectedRows) {
            res.status(400).send({ message: "Unsucessfull signup." })
        } else {
            res.status(200).send({ message: "Successfull signup." })
        }
    } catch (error){
        console.log(error)
        return res.status(400).send({ message: "Invalid data."})
    }}
})

async function randomPasswordGenerator() {
    // https://dev.to/code_mystery/random-password-generator-using-javascript-6a
    const chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const passwordLength = 12
    let password = ""
    for (var i = 0; i <= passwordLength; i++) {
        let randomNumber = Math.floor(Math.random() * chars.length)
        password += chars.substring(randomNumber, randomNumber +1)
    }
  return password
}

export default router
