export function setBooks(books) {
    let booksAuthorsGenres = {}

    books.forEach((book) => {
        if (!(book.id in booksAuthorsGenres)) {
            booksAuthorsGenres[book.id] = book
            booksAuthorsGenres[book.id]["authors"] = {}
            booksAuthorsGenres[book.id]["genres"] = {}
        }
        booksAuthorsGenres[book.id]["authors"][book.authors_id] = {
            name: book.author_name,
            id: book.authors_id
        }
        if (book?.genres_id !== null) {
            booksAuthorsGenres[book.id]["genres"][book.genres_id] = {
                name: book.genre_name,
                id: book.genres_id
            }
        }
    })

    booksAuthorsGenres = Object.values(booksAuthorsGenres).map((book) => {
        book.authors = Object.values(book.authors)
        book.genres = Object.values(book.genres)
        delete book?.genre_name
        delete book.author_name
        delete book.authors_id
        delete book.genres_id
        book.unreleased = !!book.unreleased
        return book
    })

    return booksAuthorsGenres
}