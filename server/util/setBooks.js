export function setBooks(books) {
    let booksAuthorsGenresReviews = {}

    books.forEach((book) => {
        if (!(book.id in booksAuthorsGenresReviews)) {
            booksAuthorsGenresReviews[book.id] = book
            booksAuthorsGenresReviews[book.id]["authors"] = {}
            booksAuthorsGenresReviews[book.id]["genres"] = {}
            booksAuthorsGenresReviews[book.id]["reviews"] = {}
        }
        booksAuthorsGenresReviews[book.id]["authors"][book.authors_id] = {
            name: book.author_name,
            id: book.authors_id
        }
        if (book?.genres_id !== null) {
            booksAuthorsGenresReviews[book.id]["genres"][book.genres_id] = {
                name: book.genre_name,
                id: book.genres_id
            }
        }
        if (book?.review_id !== null) {
            booksAuthorsGenresReviews[book.id]["reviews"][book.review_id] = {
                id: book.review_id,
                subject: book.review_subject,
                text: book.review_text,
                rating: book.review_rating,
                username: book.review_user_name,
                user_picture: book.review_user_picture
            }
        }
    })

    booksAuthorsGenresReviews = Object.values(booksAuthorsGenresReviews).map((book) => {
        book.authors = Object.values(book.authors)
        book.genres = Object.values(book.genres)
        book.reviews = Object.values(book.reviews)
        delete book?.genre_name
        delete book.author_name
        delete book.authors_id
        delete book.genres_id
        delete book.review_id
        delete book.review_subject
        delete book.review_text
        delete book.review_rating
        delete book.review_user_name
        delete book.review_user_picture
        book.unreleased = !!book.unreleased
        book.recommended = !!book.recommended
        book.average_rating = parseFloat(book.average_rating)
        return book
    })

    return booksAuthorsGenresReviews
}