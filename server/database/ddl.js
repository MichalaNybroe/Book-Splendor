import * as dotenv from "dotenv"
dotenv.config()
import db from "./connection.js"
import { encryptPassword } from "../util/encryption.js"

const isInDeleteMode = true

if (isInDeleteMode) {
    db.execute(`DROP TABLE IF EXISTS reviews;`)
    db.execute(`DROP TABLE IF EXISTS books_authors;`)
    db.execute(`DROP TABLE IF EXISTS books_genres;`)
    db.execute(`DROP TABLE IF EXISTS users_books`)
    db.execute(`DROP TABLE IF EXISTS users;`)
    db.execute(`DROP TABLE IF EXISTS books;`)
    db.execute(`DROP TABLE IF EXISTS series;`)
    db.execute(`DROP TABLE IF EXISTS authors;`)
    db.execute(`DROP TABLE IF EXISTS genres;`)
}

db.execute(`CREATE TABLE IF NOT EXISTS users(
    email VARCHAR(500) UNIQUE PRIMARY KEY,
    user_name VARCHAR(255),
    password VARCHAR(255),
    admin BOOLEAN,
    picture_number INTEGER,
    color VARCHAR(255)
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
    img VARCHAR(2000),
    created_date TIMESTAMP NOT NULL DEFAULT NOW(),
    series_id INTEGER,
    CONSTRAINT fk_series FOREIGN KEY (series_id) REFERENCES series(id)
);`)

db.execute(`CREATE TABLE IF NOT EXISTS users_books(
    users_id VARCHAR(500),
    books_id INTEGER,
    CONSTRAINT fk_users FOREIGN KEY (users_id) REFERENCES users(email),
    CONSTRAINT fk_books FOREIGN KEY (books_id) REFERENCES books(id),
    want_to_read BOOLEAN,
    has_read BOOLEAN,
    CONSTRAINT unique_users_books UNIQUE (users_id, books_id)
);`)

db.execute(`CREATE TABLE IF NOT EXISTS reviews(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    subject VARCHAR(50),
    text VARCHAR(1000),
    rating SMALLINT(5),
    users_id VARCHAR(500),
    CONSTRAINT fk_users FOREIGN KEY (users_id) REFERENCES users(email)
);`)

db.execute(`CREATE TABLE IF NOT EXISTS authors(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255)
);`)

db.execute(`CREATE TABLE IF NOT EXISTS books_authors(
    books_id INTEGER,
    authors_id INTEGER,
    CONSTRAINT fk_books FOREIGN KEY (books_id) REFERENCES books(id),
    CONSTRAINT fk_authors FOREIGN KEY (authors_id) REFERENCES authors(id),
    CONSTRAINT unique_books_authors UNIQUE (books_id, authors_id)
);`)

db.execute(`CREATE TABLE IF NOT EXISTS genres(
    id INTEGER PRIMARY KEY AUTO_INCREMENT UNIQUE,
    name VARCHAR(255)
);`)

db.execute(`CREATE TABLE IF NOT EXISTS books_genres(
    books_id INTEGER,
    genres_id INTEGER,
    CONSTRAINT fk_books FOREIGN KEY (books_id) REFERENCES books(id),
    CONSTRAINT fk_genres FOREIGN KEY (genres_id) REFERENCES genres(id),
    CONSTRAINT unique_books_genres UNIQUE (books_id, genres_id)
);`)


if (isInDeleteMode) {
    //users
    db.execute(`INSERT INTO users(email, user_name, password, admin, picture_number, color) 
    VALUES (?, ?, ?, ?, ?, ?);`, [process.env.ADMIN_EMAIL, "adminOne", encryptPassword(process.env.ADMIN_PASSWORD), true, 2, "#FF5733"])
    db.execute(`INSERT INTO users(email, user_name, password, admin, picture_number, color) 
    VALUES (?, ?, ?, ?, ?, ?);`, [process.env.USER_EMAIL, "mayFlower", encryptPassword(process.env.USER_PASSWORD), false, 6, "#30EBF3"])

    //series
    db.execute(`INSERT INTO series(title) VALUE (?);`, ["Lord of the Rings"])
    db.execute(`INSERT INTO series(title) VALUE (?);`, ["Hunger Games"])
    db.execute(`INSERT INTO series(title) VALUE (?);`, ["Court of Thorns and Roses"])
    db.execute(`INSERT INTO series(title) VALUE (?);`, ["The Folk of the Air"])

    //books
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, fk_series) VALUE (?, ?, ?, ?, ?, ?);`, ["The Fellowship of the Ring", "noget", 1, false, "https://upload.wikimedia.org/wikipedia/en/8/8e/The_Fellowship_of_the_Ring_cover.gif", 1])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, fk_series) VALUE (?, ?, ?, ?, ?, ?);`, ["The Two Towers", "noget", 2, false, "https://upload.wikimedia.org/wikipedia/en/thumb/a/a1/The_Two_Towers_cover.gif/220px-The_Two_Towers_cover.gif", 1])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, fk_series) VALUE (?, ?, ?, ?, ?, ?);`, ["The Return of the King", "noget", 3, false, "https://upload.wikimedia.org/wikipedia/en/thumb/1/11/The_Return_of_the_King_cover.gif/220px-The_Return_of_the_King_cover.gif", 1])

    //users_books
    db.execute(`INSERT INTO users_books(fk_users, fk_books, want_to_read, has_read) VALUE (?, ?, ?, ?);`, [process.env.USER_EMAIL, 1, false, true])
    db.execute(`INSERT INTO users_books(fk_users, fk_books, want_to_read, has_read) VALUE (?, ?, ?, ?);`, [process.env.USER_EMAIL, 2, true, false])
    
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