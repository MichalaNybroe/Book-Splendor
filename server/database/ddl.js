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
    VALUES (?, ?, ?, ?, ?, ?);`, [process.env.USER_EMAIL, "mayFlower", await encryptPassword(process.env.USER_PASSWORD), false, 3, "#A9E2E5"])
    db.execute(`INSERT INTO users(email, user_name, password, admin, picture_number, color) 
    VALUES (?, ?, ?, ?, ?, ?);`, [process.env.SECOND_USER_EMAIL, "Lilly Madelaine", await encryptPassword(process.env.USER_PASSWORD), false, 2, "#A9E2E5"])

    //series
    db.execute(`INSERT INTO series(title) VALUE (?);`, ["Lord of the Rings"])
    db.execute(`INSERT INTO series(title) VALUE (?);`, ["Hunger Games"])
    db.execute(`INSERT INTO series(title) VALUE (?);`, ["Court of Thorns and Roses"])
    db.execute(`INSERT INTO series(title) VALUE (?);`, ["The Folk of the Air"])
    db.execute(`INSERT INTO series(title) VALUE (?);`, ["The Murderbot Diaries"])
    db.execute(`INSERT INTO series(title) VALUE (?);`, ["コーヒーが冷めないうちに"])
    db.execute(`INSERT INTO series(title) VALUE (?);`, ["Maybe"])
    db.execute(`INSERT INTO series(title) VALUE (?);`, ["Throne of Glass"])
    db.execute(`INSERT INTO series(title) VALUE (?);`, ["Dragonlance: Chronicles"])
    db.execute(`INSERT INTO series(title) VALUE (?);`, ["Ready Player One"])
    db.execute(`INSERT INTO series(title) VALUE (?);`, ["Song of the Lioness"])
    db.execute(`INSERT INTO series(title) VALUE (?);`, ["Shadow and Bone"])

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
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["Before the Coffee Gets Cold", "In a small back alley in Tokyo, there is a café which has been serving carefully brewed coffee for more than one hundred years. But this coffee shop offers its customers a unique experience: the chance to travel back in time.", 1, false, "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1560955053i/44421460.jpg", 6, true])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["Before the Coffee Gets Cold: Tales from the Café", "This beautiful, simple tale tells the story of people who must face up to their past, in order to move on with their lives. Kawaguchi once again invites the reader to ask themselves: what would you change if you could travel back in time?", 2, false, "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1593780745i/54373691.jpg", 6, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["Maybe Someday", "At twenty-two years old, Sydney has a great life: She's in college, working a steady job, in love with her wonderful boyfriend, Hunter, and rooming with her best friend, Tori. But everything changes when she discovers Hunter's cheating on her--and she is left trying to decide what to do next.", 1, false, "https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781476753164/maybe-someday-9781476753164_hr.jpg", 7, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["Maybe Not", "When Warren has the opportunity to live with a female roommate, he instantly agrees. It could be an exciting change. Or maybe not.", 2, false, "https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781501125713/maybe-not-9781501125713_hr.jpg", 7, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["Witch King", "After being murdered, his consciousness dormant and unaware of the passing of time while confined in an elaborate water trap, Kai wakes to find a lesser mage attempting to harness Kai's magic to his own advantage. That was never going to go well.", 1, true, "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1663769821l/57861689._SY475_.jpg", null, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["Verity", "Lowen Ashleigh is a struggling writer on the brink of financial ruin when she accepts the job offer of a lifetime. Jeremy Crawford, husband of bestselling author Verity Crawford, has hired Lowen to complete the remaining books in a successful series his injured wife is unable to finish.", 1, false, "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1634158558i/59344312.jpg", null, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["Gone Girl", "Who are you? What have we done to each other? These are the questions Nick Dunne finds himself asking on the morning of his fifth wedding anniversary when his wife Amy suddenly disappears. The police suspect Nick. Amy's friends reveal that she was afraid of him, that she kept secrets from him. He swears it isn't true. A police examination of his computer shows strange searches. He says they weren't made by him. And then there are the persistent calls on his mobile phone.", 1, false, "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1554086139i/19288043.jpg", null, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["Sharp Objects", "Fresh from a brief stay at a psych hospital, reporter Camille Preaker faces a troubling assignment: she must return to her tiny hometown to cover the unsolved murder of a preteen girl and the disappearance of another. For years, Camille has hardly spoken to her neurotic, hypochondriac mother or to the half-sister she barely knows: a beautiful thirteen-year-old with an eerie grip on the town.", 1, false, "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1475695315i/18045891.jpg", null, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["Throne of Glass", "Meet Celaena Sardothien. Beautiful. Deadly. Destined for greatness. In a land without magic, where the king rules with an iron hand, Celaena, an assassin, is summoned to the castle. She comes not to kill the king, but to win her freedom. If she defeats twenty-three killers, thieves, and warriors in a competition, she is released from prison to serve as the king’s champion. The Crown Prince will provoke her. The Captain of the Guard will protect her. But something evil dwells in the castle of glass—and it’s there to kill. When her competitors start dying one by one, Celaena’s fight for freedom becomes a fight for survival, and a desperate quest to root out the evil before it destroys her world.", 1, false, "https://imgcdn.saxo.com/_9783423716512", 8, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["Crown of Midnight", "Meet Celaena Sardothien. Beautiful. Deadly. Destined for greatness. In a land without magic, where the king rules with an iron hand, Celaena, an assassin, is summoned to the castle. She comes not to kill the king, but to win her freedom. If she defeats twenty-three killers, thieves, and warriors in a competition, she is released from prison to serve as the king’s champion. The Crown Prince will provoke her. The Captain of the Guard will protect her. But something evil dwells in the castle of glass—and it’s there to kill. When her competitors start dying one by one, Celaena’s fight for freedom becomes a fight for survival, and a desperate quest to root out the evil before it destroys her world.", 2, false, "https://imgcdn.saxo.com/_9781619630642", 8, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["Heir of Fire", "Meet Celaena Sardothien. Beautiful. Deadly. Destined for greatness. In a land without magic, where the king rules with an iron hand, Celaena, an assassin, is summoned to the castle. She comes not to kill the king, but to win her freedom. If she defeats twenty-three killers, thieves, and warriors in a competition, she is released from prison to serve as the king’s champion. The Crown Prince will provoke her. The Captain of the Guard will protect her. But something evil dwells in the castle of glass—and it’s there to kill. When her competitors start dying one by one, Celaena’s fight for freedom becomes a fight for survival, and a desperate quest to root out the evil before it destroys her world.", 3, false, "https://imgcdn.saxo.com/_9781619630673", 8, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["Queen of Shadows", "Meet Celaena Sardothien. Beautiful. Deadly. Destined for greatness. In a land without magic, where the king rules with an iron hand, Celaena, an assassin, is summoned to the castle. She comes not to kill the king, but to win her freedom. If she defeats twenty-three killers, thieves, and warriors in a competition, she is released from prison to serve as the king’s champion. The Crown Prince will provoke her. The Captain of the Guard will protect her. But something evil dwells in the castle of glass—and it’s there to kill. When her competitors start dying one by one, Celaena’s fight for freedom becomes a fight for survival, and a desperate quest to root out the evil before it destroys her world.", 4, false, "https://imgcdn.saxo.com/_9781619636064", 8, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["Empire of Storms", "Meet Celaena Sardothien. Beautiful. Deadly. Destined for greatness. In a land without magic, where the king rules with an iron hand, Celaena, an assassin, is summoned to the castle. She comes not to kill the king, but to win her freedom. If she defeats twenty-three killers, thieves, and warriors in a competition, she is released from prison to serve as the king’s champion. The Crown Prince will provoke her. The Captain of the Guard will protect her. But something evil dwells in the castle of glass—and it’s there to kill. When her competitors start dying one by one, Celaena’s fight for freedom becomes a fight for survival, and a desperate quest to root out the evil before it destroys her world.", 5, false, "https://imgcdn.saxo.com/_9781619636095", 8, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["Tower of Dawn", "Meet Celaena Sardothien. Beautiful. Deadly. Destined for greatness. In a land without magic, where the king rules with an iron hand, Celaena, an assassin, is summoned to the castle. She comes not to kill the king, but to win her freedom. If she defeats twenty-three killers, thieves, and warriors in a competition, she is released from prison to serve as the king’s champion. The Crown Prince will provoke her. The Captain of the Guard will protect her. But something evil dwells in the castle of glass—and it’s there to kill. When her competitors start dying one by one, Celaena’s fight for freedom becomes a fight for survival, and a desperate quest to root out the evil before it destroys her world.", 6, false, "https://imgcdn.saxo.com/_9781681195773", 8, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["Kingdom of Ash", "Meet Celaena Sardothien. Beautiful. Deadly. Destined for greatness. In a land without magic, where the king rules with an iron hand, Celaena, an assassin, is summoned to the castle. She comes not to kill the king, but to win her freedom. If she defeats twenty-three killers, thieves, and warriors in a competition, she is released from prison to serve as the king’s champion. The Crown Prince will provoke her. The Captain of the Guard will protect her. But something evil dwells in the castle of glass—and it’s there to kill. When her competitors start dying one by one, Celaena’s fight for freedom becomes a fight for survival, and a desperate quest to root out the evil before it destroys her world.", 7, false, "https://imgcdn.saxo.com/_9781619636101", 8, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["Dragons of Autumn Twilight", "Once merely creatures of legend, the dragons have returned to Krynn. But with their arrival comes the departure of the old gods—and all healing magic. As war threatens to engulf the land, lifelong friends reunite for an adventure that will change their lives and shape their world forever... When Tanis, Sturm, Caramon, Raistlin, Flint, and Tasslehoff see a woman use a blue crystal staff to heal a villager, they wonder if it's a sign the gods have not abandoned them after all. Fueled by this glimmer of hope, the Companions band together to uncover the truth behind the gods' absence—though they aren't the only ones with an interest in the staff. No one expected them to be heroes. Least of all, them.", 1, false, "https://imgcdn.saxo.com/_9780786954377", 9, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["Dragons of Winter Night", "Once merely creatures of legend, the dragons have returned to Krynn. But with their arrival comes the departure of the old gods—and all healing magic. As war threatens to engulf the land, lifelong friends reunite for an adventure that will change their lives and shape their world forever... When Tanis, Sturm, Caramon, Raistlin, Flint, and Tasslehoff see a woman use a blue crystal staff to heal a villager, they wonder if it's a sign the gods have not abandoned them after all. Fueled by this glimmer of hope, the Companions band together to uncover the truth behind the gods' absence—though they aren't the only ones with an interest in the staff. No one expected them to be heroes. Least of all, them.", 2, false, "https://m.media-amazon.com/images/I/51prR0JBpaL.jpg", 9, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["Dragons of Spring Dawning", "Once merely creatures of legend, the dragons have returned to Krynn. But with their arrival comes the departure of the old gods—and all healing magic. As war threatens to engulf the land, lifelong friends reunite for an adventure that will change their lives and shape their world forever... When Tanis, Sturm, Caramon, Raistlin, Flint, and Tasslehoff see a woman use a blue crystal staff to heal a villager, they wonder if it's a sign the gods have not abandoned them after all. Fueled by this glimmer of hope, the Companions band together to uncover the truth behind the gods' absence—though they aren't the only ones with an interest in the staff. No one expected them to be heroes. Least of all, them.", 3, false, "https://imgcdn.saxo.com/_9780786915897", 9, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["Dragons of Summer Flame", "Once merely creatures of legend, the dragons have returned to Krynn. But with their arrival comes the departure of the old gods—and all healing magic. As war threatens to engulf the land, lifelong friends reunite for an adventure that will change their lives and shape their world forever... When Tanis, Sturm, Caramon, Raistlin, Flint, and Tasslehoff see a woman use a blue crystal staff to heal a villager, they wonder if it's a sign the gods have not abandoned them after all. Fueled by this glimmer of hope, the Companions band together to uncover the truth behind the gods' absence—though they aren't the only ones with an interest in the staff. No one expected them to be heroes. Least of all, them.", 4, false, "https://m.media-amazon.com/images/I/81on8DjmRsL.jpg", 9, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["Ready Player One", "IN THE YEAR 2044, reality is an ugly place. The only time teenage Wade Watts really feels alive is when he's jacked into the virtual utopia known as the OASIS. Wade's devoted his life to studying the puzzles hidden within this world's digital confines, puzzles that are based on their creator's obsession with the pop culture of decades past and that promise massive power and fortune to whoever can unlock them. But when Wade stumbles upon the first clue, he finds himself beset by players willing to kill to take this ultimate prize. The race is on, and if Wade's going to survive, he'll have to win—and confront the real world he's always been so desperate to escape.", 1, false, "https://prod-bb-images.akamaized.net/book-covers/coverimage-9788758824109-publizon-2022-04-24t03-02.jpg?w=400", 10, false])
    db.execute(`INSERT INTO books(title, description, number, unreleased, img, series_id, recommended) VALUE (?, ?, ?, ?, ?, ?, ?);`, ["Ready Player Two", "IN THE YEAR 2044, reality is an ugly place. The only time teenage Wade Watts really feels alive is when he's jacked into the virtual utopia known as the OASIS. Wade's devoted his life to studying the puzzles hidden within this world's digital confines, puzzles that are based on their creator's obsession with the pop culture of decades past and that promise massive power and fortune to whoever can unlock them. But when Wade stumbles upon the first clue, he finds himself beset by players willing to kill to take this ultimate prize. The race is on, and if Wade's going to survive, he'll have to win—and confront the real world he's always been so desperate to escape.", 2, false, "https://images.penguinrandomhouse.com/cover/9781524761349", 10, false])
    

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
    db.execute(`INSERT INTO reviews(users_id, subject, text, rating, books_id) VALUE (?, ?, ?, ?, ?);`, [3, "Still good", "Also a tad long but so interesting! Can recommend!", 4, 3])

    //authors
    db.execute(`INSERT INTO authors(name) VALUE (?);`, ["J.R.R. Tolkien"])
    db.execute(`INSERT INTO authors(name) VALUE (?);`, ["Suzanne Collins"])
    db.execute(`INSERT INTO authors(name) VALUE (?);`, ["Sarah J. Maas"])
    db.execute(`INSERT INTO authors(name) VALUE (?);`, ["Holly Black"])
    db.execute(`INSERT INTO authors(name) VALUE (?);`, ["Terry Pratchett"])
    db.execute(`INSERT INTO authors(name) VALUE (?);`, ["Neil Gaiman"])
    db.execute(`INSERT INTO authors(name) VALUE (?);`, ["Martha Wells"])
    db.execute(`INSERT INTO authors(name) VALUE (?);`, ["Toshikazu Kawaguchi"])
    db.execute(`INSERT INTO authors(name) VALUE (?);`, ["Colleen Hoover"])
    db.execute(`INSERT INTO authors(name) VALUE (?);`, ["Gillian Flynn"])
    db.execute(`INSERT INTO authors(name) VALUE (?);`, ["Margaret Weis"])
    db.execute(`INSERT INTO authors(name) VALUE (?);`, ["Tracy Hickman"])
    db.execute(`INSERT INTO authors(name) VALUE (?);`, ["Ernest Cline"])

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
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [23, 8])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [24, 8])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [25, 9])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [26, 9])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [27, 7])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [28, 9])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [29, 10])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [30, 10])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [31, 3])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [32, 3])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [33, 3])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [34, 3])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [35, 3])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [36, 3])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [37, 3])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [38, 11])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [38, 12])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [39, 11])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [39, 12])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [40, 11])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [40, 12])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [41, 11])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [41, 12])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [42, 13])
    db.execute(`INSERT INTO books_authors(books_id, authors_id) VALUE (?, ?);`, [43, 13])

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
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [23, 5])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [24, 5])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [25, 3])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [26, 3])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [27, 7])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [28, 4])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [29, 4])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [30, 4])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [31, 7])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [31, 6])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [31, 3])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [32, 7])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [32, 6])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [32, 3])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [33, 7])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [33, 6])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [33, 3])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [34, 7])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [34, 6])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [34, 3])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [35, 7])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [35, 6])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [35, 3])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [36, 7])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [36, 6])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [36, 3])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [37, 7])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [37, 6])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [37, 3])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [38, 1])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [39, 1])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [40, 1])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [41, 1])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [42, 5])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [42, 6])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [43, 5])
    db.execute(`INSERT INTO books_genres(books_id, genres_id) VALUE (?, ?);`, [43, 6])
}

db.end()