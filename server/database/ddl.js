import * as dotenv from "dotenv"
dotenv.config()
import db from "./connection.js"
import { encryptPassword } from "../util/encryption.js"

const isInDeleteMode = true

if (isInDeleteMode) {
    db.execute(`DROP TABLE IF EXISTS users;`)
    db.execute(`DROP TABLE IF EXISTS books;`)
    db.execute(`DROP TABLE IF EXISTS users_books;`)
    db.execute(`DROP TABLE IF EXISTS reviews;`)
    db.execute(`DROP TABLE IF EXISTS authors;`)
    db.execute(`DROP TABLE IF EXISTS books_authors;`)
    db.execute(`DROP TABLE IF EXISTS series;`)
    db.execute(`DROP TABLE IF EXISTS genres;`)
    db.execute(`DROP TABLE IF EXISTS books_genres;`)
}

db.execute(`CREATE TABLE IF NOT EXISTS users(
    email VARCHAR(500) PRIMARY KEY UNIQUE,
    user_name VARCHAR(255),
    password VARCHAR(255),
    admin BOOLEAN
);`)

db.execute(`CREATE TABLE IF NOT EXISTS series(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255)
);`)

db.execute(`CREATE TABLE IF NOT EXISTS books(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    description VARCHAR(1000),
    number INTEGER,
    unreleased BOOLEAN,
    created_date TIMESTAMP NOT NULL DEFAULT NOW()
    CONSTRAINT fk_series FOREIGN KEY (id) REFERENCES series(id)
);`)

db.execute(`CREATE TABLE IF NOT EXISTS users_books(
    CONSTRAINT fk_users FOREIGN KEY (email) REFERENCES users(email),
    CONSTRAINT fk_books FOREIGN KEY (id) REFERENCES books(id),
    want_to_read BOOLEAN,
    has_read BOOLEAN,
    CONSTRAINT UC_users_books UNIQUE ()
);`)
//tjek: constraint on foreign keys

db.execute(`CREATE TABLE IF NOT EXISTS reviews(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    subject VARCHAR(50),
    text VARCHAR(1000),
    rating SMALLINT(5),
    CONSTRAINT fk_users FOREIGN KEY (email) REFERENCES users(email)
);`)

db.execute(`CREATE TABLE IF NOT EXISTS authors(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255)
);`)

db.execute(`CREATE TABLE IF NOT EXISTS books_authors(
    CONSTRAINT fk_books FOREIGN KEY (id) REFERENCES books(id),
    CONSTRAINT fk_authors FOREIGN KEY (id) REFERENCES authors(id)
);`)

db.execute(`CREATE TABLE IF NOT EXISTS genres(
    id INTEGER PRIMARY KEY AUTO_INCREMENT UNIQUE,
    name VARCHAR(255)
);`)

db.execute(`CREATE TABLE IF NOT EXISTS books_genres(
    CONSTRAINT fk_books FOREIGN KEY (id) REFERENCES books(id),
    CONSTRAINT fk_genres FOREIGN KEY (id) REFERENCES genres(id)
);`)


if (isInDeleteMode) {
    //users
    db.execute(`INSERT INTO users(email, user_name, password, admin) 
    VALUES (?, ?, ?, ?);`, [process.env.ADMIN_EMAIL, "adminOne", encryptPassword(process.env.ADMIN_PASSWORD), true])
    db.execute(`INSERT INTO users(email, user_name, password, admin) 
    VALUES (?, ?, ?, ?);`, [process.env.USER_EMAIL, "mayFlower", encryptPassword(process.env.USER_PASSWORD), false])

    //series
    db.execute(`INSERT INTO series(title) VALUE (?);`, ["Lord of the Rings"])
    db.execute(`INSERT INTO series(title) VALUE (?);`, ["Hunger Games"])
    db.execute(`INSERT INTO series(title) VALUE (?);`, ["Court of Thorns and Roses"])
    db.execute(`INSERT INTO series(title) VALUE (?);`, ["The Folk of the Air"])

    //books
    db.execute(`INSERT INTO books(title, description, number, unreleased, fk_series) VALUE (?, ?, ?, ?, ?);`, ["The Fellowship of the Ring", "noget", 1, false, 1])
    db.execute(`INSERT INTO books(title, description, number, unreleased, fk_series) VALUE (?, ?, ?, ?, ?);`, ["The Two Towers", "noget", 2, false, 1])
    db.execute(`INSERT INTO books(title, description, number, unreleased, fk_series) VALUE (?, ?, ?, ?, ?);`, ["The Return of the King", "noget", 3, false, 1])

    //users_books
    // TO DO 
    db.execute(`INSERT INTO users_books(fk_users, fk_books, want_to_read, has_read, x) VALUE (?, ?, ?, ?, ?);`, [process.env.USER_EMAIL, 1, false, true, x])
    db.execute(`INSERT INTO users_books(fk_users, fk_books, want_to_read, has_read, x) VALUE (?, ?, ?, ?, ?);`, [process.env.USER_EMAIL, 2, true, false, x])
    
    //reviews
    db.execute(`INSERT INTO reviews(subject, text, rating, fk_users) VALUE (?, ?, ?, ?);`, ["LOVED IT", "LOVED ITTT", 4, process.env.USER_EMAIL])

    //authors
    db.execute(`INSERT INTO authors(name) VALUE (?);`, ["J.R.R. Tolkien"])
    db.execute(`INSERT INTO authors(name) VALUE (?);`, ["Suzanne Collins"])
    db.execute(`INSERT INTO authors(name) VALUE (?);`, ["Sarah J. Maas"])
    db.execute(`INSERT INTO authors(name) VALUE (?);`, ["Holly Black"])

    //books_authors
    db.execute(`INSERT INTO books_authors(fk_books, fk_authors) VALUE (?, ?);`, [1, 1])
    db.execute(`INSERT INTO books_authors(fk_books, fk_authors) VALUE (?, ?);`, [2, 1])
    db.execute(`INSERT INTO books_authors(fk_books, fk_authors) VALUE (?, ?);`, [3, 1])

    //genres
    db.execute(`INSERT INTO genres(name) VALUE (?);`, ["High Fantasy"])
    db.execute(`INSERT INTO genres(name) VALUE (?);`, ["Adventure"])
    db.execute(`INSERT INTO genres(name) VALUE (?);`, ["Romance"])
    db.execute(`INSERT INTO genres(name) VALUE (?);`, ["Thriller"])
    db.execute(`INSERT INTO genres(name) VALUE (?);`, ["Sci-fi"])

    //books_genres
    db.execute(`INSERT INTO books_genres(fk_books, fk_genres) VALUE (?, ?);`, [1, 1])
    db.execute(`INSERT INTO books_genres(fk_books, fk_genres) VALUE (?, ?);`, [1, 2])
    db.execute(`INSERT INTO books_genres(fk_books, fk_genres) VALUE (?, ?);`, [2, 1])
    db.execute(`INSERT INTO books_genres(fk_books, fk_genres) VALUE (?, ?);`, [2, 2])
    db.execute(`INSERT INTO books_genres(fk_books, fk_genres) VALUE (?, ?);`, [3, 1])
    db.execute(`INSERT INTO books_genres(fk_books, fk_genres) VALUE (?, ?);`, [3, 2])

}