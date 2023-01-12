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
        const [rows, fields] = await db.query(
            `SELECT users.*,
            reviews.id AS review_id,
            reviews.subject AS review_subject,
            reviews.text AS review_text,
            reviews.rating AS review_rating,
            books.title AS review_book_title
            FROM users
                LEFT JOIN reviews ON reviews.users_id = users.id
                LEFT JOIN books ON reviews.books_id = books.id
            WHERE email=?;`, [email]
        )
        const userInfo = rows

        const user = await cleanUserInfo(userInfo)

        if (!user || await !comparePassword(password, user[0].password)) {
            return res.status(401).send({ message: "Login failed." })
        } else {
            req.session.isLoggedIn = true
            req.session.admin = user[0].admin
            req.session.userid = user[0].id
            if (user[0].admin === true) {
                res.status(200).send({ data: {id: user[0].id, email: user[0].email, admin: user[0].admin }, message: "Login successful" })
                return
            }
            res.status(200).send({ data: {id: user[0].id, email: user[0].email, user_name: user[0].user_name, admin: user[0].admin, picture_number: user[0].picture_number, color: user[0].color, reviews: user[0].reviews }, message: "Login successful" })
        }
    } catch {
        res.status(500).send({ message: "Server error." })
    }
})


router.post("/logout", (req, res) => {
    req.session.destroy()
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

async function cleanUserInfo(userInfo) {
    let cleanUser = {}

    userInfo.forEach((user) => {
        if (!(user.id in cleanUser)) {
            cleanUser[user.id] = user
            if(!cleanUser[user.id].admin) { 
                cleanUser[user.id]["reviews"] = {}
            }
        }

        if (cleanUser[user.id].reviews) {
            cleanUser[user.id]["reviews"][user.review_id] = {
                id: user.review_id,
                subject: user.review_subject,
                text: user.review_text,
                rating: user.review_rating,
                book_title: user.review_book_title
            }
        }
    })
 
    cleanUser = Object.values(cleanUser).map((user) => {
        if (user.reviews) {
            user.reviews = Object.values(user.reviews)
        }
        delete user.review_id
        delete user.review_subject
        delete user.review_text
        delete user.review_rating
        delete user.review_book_title
        user.admin = !!user.admin
        return user   
    })

    return cleanUser
}

export default router
