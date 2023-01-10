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
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(500) UNIQUE NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    admin BOOLEAN NOT NULL,
    picture_number INTEGER,
    color VARCHAR(255)
);`)

db.execute(`CREATE TABLE IF NOT EXISTS series(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL
);`)

db.execute(`CREATE TABLE IF NOT EXISTS books(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    number INTEGER,
    unreleased BOOLEAN NOT NULL,
    img VARCHAR(2000) NOT NULL,
    created_date TIMESTAMP NOT NULL DEFAULT NOW(),
    series_id INTEGER,
    CONSTRAINT fk_series FOREIGN KEY (series_id) REFERENCES series(id) ON DELETE CASCADE
);`)

db.execute(`CREATE TABLE IF NOT EXISTS users_books(
    users_id INTEGER NOT NULL,
    books_id INTEGER NOT NULL,
    CONSTRAINT fk_users_books_id FOREIGN KEY (users_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_books_users_id FOREIGN KEY (books_id) REFERENCES books(id) ON DELETE CASCADE,
    want_to_read BOOLEAN NOT NULL DEFAULT 0,
    has_read BOOLEAN NOT NULL DEFAULT 0,
    CONSTRAINT unique_users_books UNIQUE (users_id, books_id)
);`)

db.execute(`CREATE TABLE IF NOT EXISTS reviews(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    subject VARCHAR(50) NOT NULL,
    text VARCHAR(1000),
    rating SMALLINT(5) NOT NULL,
    users_id INTEGER NOT NULL,
    CONSTRAINT fk_users_reviews FOREIGN KEY (users_id) REFERENCES users(id) ON DELETE CASCADE
);`)

db.execute(`CREATE TABLE IF NOT EXISTS authors(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);`)

db.execute(`CREATE TABLE IF NOT EXISTS books_authors(
    books_id INTEGER NOT NULL,
    authors_id INTEGER NOT NULL,
    CONSTRAINT fk_books_authors FOREIGN KEY (books_id) REFERENCES books(id) ON DELETE CASCADE,
    CONSTRAINT fk_authors_books FOREIGN KEY (authors_id) REFERENCES authors(id) ON DELETE CASCADE,
    CONSTRAINT unique_books_authors UNIQUE (books_id, authors_id)
);`)

db.execute(`CREATE TABLE IF NOT EXISTS genres(
    id INTEGER PRIMARY KEY AUTO_INCREMENT UNIQUE,
    name VARCHAR(255) NOT NULL
);`)

db.execute(`CREATE TABLE IF NOT EXISTS books_genres(
    books_id INTEGER NOT NULL,
    genres_id INTEGER NOT NULL,
    CONSTRAINT fk_books_genres FOREIGN KEY (books_id) REFERENCES books(id) ON DELETE CASCADE,
    CONSTRAINT fk_genres_books FOREIGN KEY (genres_id) REFERENCES genres(id) ON DELETE CASCADE,
    CONSTRAINT unique_books_genres UNIQUE (books_id, genres_id)
);`)


if (isInDeleteMode) {
    //users
    db.execute(`INSERT INTO users(email, user_name, password, admin, picture_number, color) 
    VALUES (?, ?, ?, ?, ?, ?);`, [process.env.ADMIN_EMAIL, "adminOne", await encryptPassword(process.env.ADMIN_PASSWORD), true, 2, "#FF5733"])
    db.execute(`INSERT INTO users(email, user_name, password, admin, picture_number, color) 
    VALUES (?, ?, ?, ?, ?, ?);`, [process.env.USER_EMAIL, "mayFlower", await encryptPassword(process.env.USER_PASSWORD), false, 6, "#30EBF3"])

    //series
    db.execute(`INSERT INTO series(title) VALUE (?);`, ["Lord of the Rings"])
    db.execute(`INSERT INTO series(title) VALUE (?);`, ["Hunger Games"])
    db.execute(`INSERT INTO series(title) VALUE (?);`, ["Court of Thorns and Roses"])
    db.execute(`INSERT INTO series(title) VALUE (?);`, ["The Folk of the Air"])
    db.execute(`INSERT INTO series(title) VALUE (?);`, ["The Murderbot Diaries"])

    //books
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id) VALUE (?, ?, ?, ?, ?, ?);`, ["The Fellowship of the Ring", "noget", 1, false, "https://upload.wikimedia.org/wikipedia/en/8/8e/The_Fellowship_of_the_Ring_cover.gif", 1])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id) VALUE (?, ?, ?, ?, ?, ?);`, ["The Two Towers", "noget", 2, false, "https://upload.wikimedia.org/wikipedia/en/thumb/a/a1/The_Two_Towers_cover.gif/220px-The_Two_Towers_cover.gif", 1])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id) VALUE (?, ?, ?, ?, ?, ?);`, ["The Return of the King", "noget", 3, false, "https://upload.wikimedia.org/wikipedia/en/thumb/1/11/The_Return_of_the_King_cover.gif/220px-The_Return_of_the_King_cover.gif", 1])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id) VALUE (?, ?, ?, ?, ?, ?);`, ["Good Omens", "noget", 1, false, "http://prodimage.images-bn.com/pimages/9780060853976_p0_v9_s1200x630.jpg", null])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id) VALUE (?, ?, ?, ?, ?, ?);`, ["All Systems Red", "An award-winning sci-fi bestseller about the humanity of Artificial Intelligence.", 1, false, "https://upload.wikimedia.org/wikipedia/en/8/8f/All_Systems_Red_-_The_Murderbot_Diaries_1_%28cover%29.jpg", 2])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id) VALUE (?, ?, ?, ?, ?, ?);`, ["Artificial Condition", "An award-winning sci-fi bestseller about the humanity of Artificial Intelligence.", 2, false, "https://media.forbiddenplanet.com/products/e0/91/5066da797b3f7d17c307ba7847550af54b2e.jpg", 2])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id) VALUE (?, ?, ?, ?, ?, ?);`, ["Rogue Protocol", "An award-winning sci-fi bestseller about the humanity of Artificial Intelligence.", 3, false, "https://upload.wikimedia.org/wikipedia/en/8/8f/All_Systems_Red_-_The_Murderbot_Diaries_1_%28cover%29.jpg", 2])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id) VALUE (?, ?, ?, ?, ?, ?);`, ["Exit Strategy", "An award-winning sci-fi bestseller about the humanity of Artificial Intelligence.", 4, false, "https://m.media-amazon.com/images/I/51bndThl8tL.jpg", 2])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id) VALUE (?, ?, ?, ?, ?, ?);`, ["Network Effect", "An award-winning sci-fi bestseller about the humanity of Artificial Intelligence.", 5, false, "https://kbimages1-a.akamaihd.net/69f046c9-cd75-47e1-971f-f926f5ff6611/1200/1200/False/network-effect-1.jpg", 2])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id) VALUE (?, ?, ?, ?, ?, ?);`, ["Fugitive Telemetry", "An award-winning sci-fi bestseller about the humanity of Artificial Intelligence.", 6, false, "https://m.media-amazon.com/images/I/41fAH7017RL._AC_SY1000_.jpg", 2])

    //users_books
    db.execute(`INSERT INTO users_books(users_id, books_id, want_to_read, has_read) VALUE (?, ?, ?, ?);`, [2, 1, false, true])
    db.execute(`INSERT INTO users_books(users_id, books_id, want_to_read, has_read) VALUE (?, ?, ?, ?);`, [2, 2, true, false])
    
    //reviews
    db.execute(`INSERT INTO reviews(users_id, subject, text, rating) VALUE (?, ?, ?, ?);`, [2, "LOVED IT", "LOVED ITTT", 4])
    db.execute(`INSERT INTO reviews(users_id, subject, text, rating) VALUE (?, ?, ?, ?);`, [2, "Big fan", "My favourite book ever", 5])

    //authors
    db.execute(`INSERT INTO authors(name) VALUE (?);`, ["J.R.R. Tolkien"])
    db.execute(`INSERT INTO authors(name) VALUE (?);`, ["Suzanne Collins"])
    db.execute(`INSERT INTO authors(name) VALUE (?);`, ["Sarah J. Maas"])
    db.execute(`INSERT INTO authors(name) VALUE (?);`, ["Holly Black"])
    db.execute(`INSERT INTO authors(name) VALUE (?);`, ["Terry Pratchett"])
    db.execute(`INSERT INTO authors(name) VALUE (?);`, ["Neil Gaiman"])
    db.execute(`INSERT INTO authors(name) VALUE (?);`, ["Martha Wells"])

    //books_authors
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [1, 1])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [2, 1])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [3, 1])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [4, 5])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [4, 6])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [5, 7])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [6, 7])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [7, 7])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [8, 7])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [9, 7])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [10, 7])

    //genres
    db.execute(`INSERT INTO genres(name) VALUE (?);`, ["High Fantasy"])
    db.execute(`INSERT INTO genres(name) VALUE (?);`, ["Adventure"])
    db.execute(`INSERT INTO genres(name) VALUE (?);`, ["Romance"])
    db.execute(`INSERT INTO genres(name) VALUE (?);`, ["Thriller"])
    db.execute(`INSERT INTO genres(name) VALUE (?);`, ["Sci-fi"])

    //books_genres
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [1, 1])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [1, 2])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [2, 1])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [2, 2])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [3, 1])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [3, 2])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [4, 5])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [5, 5])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [6, 5])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [7, 5])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [8, 5])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [9, 5])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [10, 5])
}

db.end()