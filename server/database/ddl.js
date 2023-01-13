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
    recommended BOOLEAN,
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
    books_id INTEGER NOT NULL,
    CONSTRAINT fk_users_reviews FOREIGN KEY (users_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_books_reviews FOREIGN KEY (books_id) REFERENCES books(id) ON DELETE CASCADE,
    CONSTRAINT unique_users_books UNIQUE (users_id, books_id)
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
    db.execute(`INSERT INTO users(email, user_name, password, admin, picture_number, color) 
    VALUES (?, ?, ?, ?, ?, ?);`, [process.env.SECOND_USER_EMAIL, "Lilly Madelaine", await encryptPassword(process.env.USER_PASSWORD), false, 6, "#30EBF3"])

    //series
    db.execute(`INSERT INTO series(title) VALUE (?);`, ["Lord of the Rings"])
    db.execute(`INSERT INTO series(title) VALUE (?);`, ["Hunger Games"])
    db.execute(`INSERT INTO series(title) VALUE (?);`, ["Court of Thorns and Roses"])
    db.execute(`INSERT INTO series(title) VALUE (?);`, ["The Folk of the Air"])
    db.execute(`INSERT INTO series(title) VALUE (?);`, ["The Murderbot Diaries"])

    //books
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["The Fellowship of the Ring", "One Ring to rule them all, One Ring to find them, One Ring to bring them all and in the darkeness bind them. In ancient times the Rings of Power were crafted by the Elven-smiths, and Sauron, The Dark Lord, forged the One Ring, filling it with his own power so that he could rule all others. But the One Ring was taken from him, and though he sought it throughout Middle-earth, it remained lost to him. After many ages it fell into the hands of Bilbo Baggins, as told in The Hobbit.", 1, false, "https://upload.wikimedia.org/wikipedia/en/8/8e/The_Fellowship_of_the_Ring_cover.gif", 1, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["The Two Towers", "One Ring to rule them all, One Ring to find them, One Ring to bring them all and in the darkeness bind them. In ancient times the Rings of Power were crafted by the Elven-smiths, and Sauron, The Dark Lord, forged the One Ring, filling it with his own power so that he could rule all others. But the One Ring was taken from him, and though he sought it throughout Middle-earth, it remained lost to him. After many ages it fell into the hands of Bilbo Baggins, as told in The Hobbit.", 2, false, "https://upload.wikimedia.org/wikipedia/en/thumb/a/a1/The_Two_Towers_cover.gif/220px-The_Two_Towers_cover.gif", 1, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["The Return of the King", "One Ring to rule them all, One Ring to find them, One Ring to bring them all and in the darkeness bind them. In ancient times the Rings of Power were crafted by the Elven-smiths, and Sauron, The Dark Lord, forged the One Ring, filling it with his own power so that he could rule all others. But the One Ring was taken from him, and though he sought it throughout Middle-earth, it remained lost to him. After many ages it fell into the hands of Bilbo Baggins, as told in The Hobbit.", 3, false, "https://upload.wikimedia.org/wikipedia/en/thumb/1/11/The_Return_of_the_King_cover.gif/220px-The_Return_of_the_King_cover.gif", 1, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["Good Omens", "According to the Nice and Accurate Prophecies of Agnes Nutter - the world's only totally reliable guide to the future - the world will end on a Saturday. Next Saturday, in fact. Just after tea...", 1, false, "http://prodimage.images-bn.com/pimages/9780060853976_p0_v9_s1200x630.jpg", null, , false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["All Systems Red", "An award-winning sci-fi bestseller about the humanity of Artificial Intelligence.", 1, false, "https://upload.wikimedia.org/wikipedia/en/8/8f/All_Systems_Red_-_The_Murderbot_Diaries_1_%28cover%29.jpg", 5, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["Artificial Condition", "An award-winning sci-fi bestseller about the humanity of Artificial Intelligence.", 2, false, "https://media.forbiddenplanet.com/products/e0/91/5066da797b3f7d17c307ba7847550af54b2e.jpg", 5, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["Rogue Protocol", "An award-winning sci-fi bestseller about the humanity of Artificial Intelligence.", 3, false, "https://images.squarespace-cdn.com/content/v1/5495fc96e4b0d669a5b4ba80/1533270909832-90R2OY348XVZ4ETG5FIC/rogue-protocol-cover.jpg", 5, true])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["Exit Strategy", "An award-winning sci-fi bestseller about the humanity of Artificial Intelligence.", 4, false, "https://m.media-amazon.com/images/I/51bndThl8tL.jpg", 5, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["Network Effect", "An award-winning sci-fi bestseller about the humanity of Artificial Intelligence.", 5, false, "https://kbimages1-a.akamaihd.net/69f046c9-cd75-47e1-971f-f926f5ff6611/1200/1200/False/network-effect-1.jpg", 5, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["Fugitive Telemetry", "An award-winning sci-fi bestseller about the humanity of Artificial Intelligence.", 6, false, "https://m.media-amazon.com/images/I/41fAH7017RL._AC_SY1000_.jpg", 5, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["A Court of Thorns and Roses", "Feyre is a huntress. She thinks nothing of slaughtering a wolf to capture its prey. But, like all mortals, she fears what lingers mercilessly beyond the forest. And she will learn that taking the life of a magical creature comes at a high price…", 1, false, "https://kbimages1-a.akamaihd.net/b3fcbbc4-ccab-4304-a971-ce95f4a0de7e/1200/1200/False/a-court-of-thorns-and-roses-1.jpg", 3, true])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["A Court of Mist and Fury", "Feyre is a huntress. She thinks nothing of slaughtering a wolf to capture its prey. But, like all mortals, she fears what lingers mercilessly beyond the forest. And she will learn that taking the life of a magical creature comes at a high price…", 2, false, "https://images.booksense.com/images/583/575/9781635575583.jpg", 3, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["A Court of Wings and Ruin", "Feyre is a huntress. She thinks nothing of slaughtering a wolf to capture its prey. But, like all mortals, she fears what lingers mercilessly beyond the forest. And she will learn that taking the life of a magical creature comes at a high price…", 3, false, "https://images.booksense.com/images/606/575/9781635575606.jpg", 3, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["A Court of Frost and Starlight", "Feyre is a huntress. She thinks nothing of slaughtering a wolf to capture its prey. But, like all mortals, she fears what lingers mercilessly beyond the forest. And she will learn that taking the life of a magical creature comes at a high price…", 4, false, "https://res.cloudinary.com/bloomsbury-atlas/image/upload/w_568,c_scale/jackets/9781681199061.jpg", 3, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["A Court of Silver Flames", "Feyre is a huntress. She thinks nothing of slaughtering a wolf to capture its prey. But, like all mortals, she fears what lingers mercilessly beyond the forest. And she will learn that taking the life of a magical creature comes at a high price…", 5, false, "https://kbimages1-a.akamaihd.net/33cbc7f1-dd5c-4d2c-a17f-adbc68569d7e/1200/1200/False/a-court-of-silver-flames.jpg", 3, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["The Cruel Prince", "Jude was seven when her parents were murdered and she and her two sisters were stolen away to live in the treacherous High Court of Faerie.", 1, false, "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1574535986i/26032825.jpg", 4, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["The Wicked King", "Jude was seven when her parents were murdered and she and her two sisters were stolen away to live in the treacherous High Court of Faerie.", 2, false, "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1520620414i/26032887.jpg", 4, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["The Queen of Nothing", "Jude was seven when her parents were murdered and she and her two sisters were stolen away to live in the treacherous High Court of Faerie.", 3, false, "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1553624975i/26032912.jpg", 4, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["How the King of Elfhame Learned to Hate Stories", "Jude was seven when her parents were murdered and she and her two sisters were stolen away to live in the treacherous High Court of Faerie.", 4, false, "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1589827409i/53439886.jpg", 4, true])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["The Hunger Games", "Winning means fame and fortune. Losing means certain death. The Hunger Games have begun. . . . In the ruins of a place once known as North America lies the nation of Panem, a shining Capitol surrounded by twelve outlying districts. The Capitol is harsh and cruel and keeps the districts in line by forcing them all to send one boy and one girl between the ages of twelve and eighteen to participate in the annual Hunger Games, a fight to the death on live TV. Sixteen-year-old Katniss Everdeen regards it as a death sentence when she steps forward to take her sister's place in the Games. But Katniss has been close to dead before-and survival, for her, is second nature. Without really meaning to, she becomes a contender. But if she is to win, she will have to start making choices that weigh survival against humanity and life against love.", 1, false, "https://catalog.kentonlibrary.org/opac/extras/ac/jacket/large/r/593617", 2, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["Catching Fire", "Winning means fame and fortune. Losing means certain death. The Hunger Games have begun. . . . In the ruins of a place once known as North America lies the nation of Panem, a shining Capitol surrounded by twelve outlying districts. The Capitol is harsh and cruel and keeps the districts in line by forcing them all to send one boy and one girl between the ages of twelve and eighteen to participate in the annual Hunger Games, a fight to the death on live TV. Sixteen-year-old Katniss Everdeen regards it as a death sentence when she steps forward to take her sister's place in the Games. But Katniss has been close to dead before-and survival, for her, is second nature. Without really meaning to, she becomes a contender. But if she is to win, she will have to start making choices that weigh survival against humanity and life against love.", 2, false, "https://imgcdn.saxo.com/_9780439023498", 2, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["Mockingjay", "Winning means fame and fortune. Losing means certain death. The Hunger Games have begun. . . . In the ruins of a place once known as North America lies the nation of Panem, a shining Capitol surrounded by twelve outlying districts. The Capitol is harsh and cruel and keeps the districts in line by forcing them all to send one boy and one girl between the ages of twelve and eighteen to participate in the annual Hunger Games, a fight to the death on live TV. Sixteen-year-old Katniss Everdeen regards it as a death sentence when she steps forward to take her sister's place in the Games. But Katniss has been close to dead before-and survival, for her, is second nature. Without really meaning to, she becomes a contender. But if she is to win, she will have to start making choices that weigh survival against humanity and life against love.", 3, false, "https://imgcdn.saxo.com/_9780439023511", 2, false])

    //users_books
    db.execute(`INSERT INTO users_books(users_id, books_id, want_to_read, has_read) VALUE (?, ?, ?, ?);`, [2, 1, false, true])
    db.execute(`INSERT INTO users_books(users_id, books_id, want_to_read, has_read) VALUE (?, ?, ?, ?);`, [2, 2, true, false])
    db.execute(`INSERT INTO users_books(users_id, books_id, want_to_read, has_read) VALUE (?, ?, ?, ?);`, [3, 11, true, false])
    db.execute(`INSERT INTO users_books(users_id, books_id, want_to_read, has_read) VALUE (?, ?, ?, ?);`, [3, 1, false, true])
    db.execute(`INSERT INTO users_books(users_id, books_id, want_to_read, has_read) VALUE (?, ?, ?, ?);`, [3, 2, false, true])
    db.execute(`INSERT INTO users_books(users_id, books_id, want_to_read, has_read) VALUE (?, ?, ?, ?);`, [3, 3, false, true])
    db.execute(`INSERT INTO users_books(users_id, books_id, want_to_read, has_read) VALUE (?, ?, ?, ?);`, [3, 20, true, false])
    
    //reviews
    db.execute(`INSERT INTO reviews(users_id, subject, text, rating, books_id) VALUE (?, ?, ?, ?, ?);`, [2, "LOVED IT", "LOVED ITTT", 4, 5])
    db.execute(`INSERT INTO reviews(users_id, subject, text, rating, books_id) VALUE (?, ?, ?, ?, ?);`, [2, "Big fan", "My favourite book ever", 5, 11])
    db.execute(`INSERT INTO reviews(users_id, subject, text, rating, books_id) VALUE (?, ?, ?, ?, ?);`, [2, "Not for me", "This book is so good for my poor taste :(", 2, 6])
    db.execute(`INSERT INTO reviews(users_id, subject, text, rating, books_id) VALUE (?, ?, ?, ?, ?);`, [2, "Funny", "These two guys can make some pretty funny stuff!", 4, 4])
    db.execute(`INSERT INTO reviews(users_id, subject, text, rating, books_id) VALUE (?, ?, ?, ?, ?);`, [3, "Intrigued!", "I enjoyed it so much!!", 5, 1])
    db.execute(`INSERT INTO reviews(users_id, subject, text, rating, books_id) VALUE (?, ?, ?, ?, ?);`, [3, "Still good", "A tad long but so interesting! Can recommend!", 4, 2])
    db.execute(`INSERT INTO reviews(users_id, subject, text, rating, books_id) VALUE (?, ?, ?, ?, ?);`, [3, "Still good", "A tad long but so interesting! Can recommend!", 4, 3])

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
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [11, 3])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [12, 3])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [13, 3])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [14, 3])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [15, 3])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [16, 4])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [17, 4])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [18, 4])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [19, 4])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [20, 2])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [21, 2])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [22, 2])

    //genres
    db.execute(`INSERT INTO genres(name) VALUE (?);`, ["High Fantasy"])
    db.execute(`INSERT INTO genres(name) VALUE (?);`, ["Adventure"])
    db.execute(`INSERT INTO genres(name) VALUE (?);`, ["Romance"])
    db.execute(`INSERT INTO genres(name) VALUE (?);`, ["Thriller"])
    db.execute(`INSERT INTO genres(name) VALUE (?);`, ["Sci-fi"])
    db.execute(`INSERT INTO genres(name) VALUE (?);`, ["Young Adult"])
    db.execute(`INSERT INTO genres(name) VALUE (?);`, ["Fantasy"])

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
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [11, 3])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [11, 6])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [11, 7])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [12, 3])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [12, 6])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [12, 7])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [13, 3])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [13, 6])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [13, 7])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [14, 3])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [14, 6])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [14, 7])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [15, 3])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [15, 6])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [15, 7])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [16, 1])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [16, 6])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [17, 1])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [17, 6])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [18, 1])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [18, 6])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [19, 1])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [19, 6])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [20, 5])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [20, 6])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [21, 5])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [21, 6])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [22, 5])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [22, 6])
}

db.end()