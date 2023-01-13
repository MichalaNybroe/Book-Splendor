<script>
    import { BASE_URL } from '../store/globals.js'
    import * as Toastr from 'toastr'
    import '../../node_modules/toastr/build/toastr.css'


    let searchIdForm
    let searchTitleForm
    let searchAuthorForm
    let searchId = ''
    let searchAuthor = ''
    let searchTitle = ''

    async function searchBooks(endpoint) {
        try {
            const response = await fetch(`${$BASE_URL}/api/${endpoint}`, {
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            })

            if (response.ok) {
                const data = await response.json()
                books = data.data
            } else {
                Toastr.warning('Unable to retrieve books.')
            }
        } catch {
            Toastr.error('Unable to retrieve books. Try again later.')
        }
    }

    async function searchById() {
        searchBooks(`books/${searchId}`)
    }

    async function searchByTitle() {
        searchBooks(`books/${searchTitle}`)
    }

    async function searchByAuthor() {
        searchBooks(`authors/${searchAuthor}`)
    }

</script>

<h3>Search books</h3>
<form id="searchBooksForm" bind:this={searchIdForm} on:submit|preventDefault={searchById}>
    <label for="search_books_id">Search by Id</label>
    <input type="number" name="search_books_id" id="search_books_id" bind:value={searchId} required>
    <button type="submit">Search</button>
</form>

<form id="searchBooksForm" bind:this={searchTitleForm} on:submit|preventDefault={searchByTitle}>
    <label for="search_books_title">Search by Title</label>
    <input type="text" name="search_books_title" id="search_books_title" bind:value={searchTitle} required>
    <button type="submit">Search</button>
</form>

<form id="searchBooksForm" bind:this={searchAuthorForm} on:submit|preventDefault={searchByAuthor}>
    <label for="search_books_author">Search by Author</label>
    <input type="text" name="search_books_author" id="search_books_author" bind:value={searchAuthor} required>
    <button type="submit">Search</button>
</form>