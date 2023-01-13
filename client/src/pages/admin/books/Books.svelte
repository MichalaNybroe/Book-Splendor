<script>
    import { Router, Link, useNavigate } from 'svelte-navigator'
    import { BASE_URL } from '../../../store/globals.js'
    import { user } from '../../../store/auth'
    import * as Toastr from 'toastr'
    import '../../../../node_modules/toastr/build/toastr.css'
    import Button from '../../../components/Button.svelte'
    import { Confirm } from 'svelte-confirm'
 

    const navigate = useNavigate()

    if($user?.admin !== true) {
        navigate('/')
    }


    let books = []
    let columns = ['Id', 'Title', 'Number', 'Series', 'Authors', 'Genres', 'Recommend' ,'Update', 'Delete']

    async function retrieveBooks() {
        try {
            const response = await fetch(`${$BASE_URL}/api/books`, {
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

    
    // BOOKS OF THE WEEK
    async function toggleRecommend(book) {
        book.recommended = !book.recommended        

        const body = {
            recommended: book.recommended
        }
        
        try {
            const response = await fetch(`${$BASE_URL}/api/books/${book.id}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })

        if (!response.ok) {
            const json = await response.json()
            Toastr.warning(json.message)
            return
        }
            Toastr.success(`${book.title} registered as recommended.`)
        } catch {
            Toastr.error('Unable to recommend book. Try again later.')
            return
        }
    }
    // END OF BOOKS OF THE WEEK

	
	async function deleteBook(book) {
        try {
            const response = await fetch(`${$BASE_URL}/api/books/${book.id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            })

            if (!response.ok) {
                const json = await response.json()
                Toastr.warning(json.message)
                return
            }

            books = books.filter(row => row != book)
        } catch {
            Toastr.error('Unable to delete book. Try again later.')
	    }
    }



    // Search books
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
                const dataList = Object.values(data)

                if (dataList.length === 1) {
                    books = [dataList[0]]
                } else {
                    books.push(dataList[0])
                    books = books
                }

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



    retrieveBooks()
</script>

<p>
<Router primary={false}>
    <Link to="/admin/books/create">Create Book</Link>
</Router>
</p>


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



<table>
	<tr>
		{#each columns as column}
			<th>{column}</th>
		{/each}
	</tr>
	
	{#each books as book}
		<tr>
			<td>{book.id}</td>
			<td>{book.title}</td>
			<td>{book.number}</td>
			<td>{book.series_title ?? ''}</td>
			<td>{book.authors.map((author) => author.name).join(', ')}</td>
            <td>{book.genres.map((genre) => genre.name).join(', ')}</td>
            <td>   
			<input type="checkbox" bind:checked={book.recommended} on:click={()=> toggleRecommend(book)} />
            </td>
            <td>
                <Link class="update" to="/admin/books/{book.id}/update">
                    <i class="fa fa-pencil"></i>
                </Link>
            </td>
            <td>
                <Confirm
                confirmTitle="Delete"
                themeColor="110"
                let:confirm="{confirmThis}"
                >
                    <Button class="danger" on:click={()=> confirmThis(deleteBook, book)}>
                        <i class="w3-margin-left fa fa-trash"></i>
                    </Button>
                </Confirm>
            </td>
		</tr>
	{/each}
</table>

<style>
    p {
        margin-left: 37.5px;
    }

    input,
    select {
        color: #5a5a5a;
        font: inherit;
        margin: 0;
    }

    input {
        line-height: normal;
    }

    button {
        background: none;
        border: none;
        color: #474544;
        cursor: pointer;
        display: inline-block;
        font-family: "Helvetica", Arial, sans-serif;
        font-size: 0.875em;
        font-weight: bold;
        outline: none;
        padding: 5px 15px;
    }

    button:hover {
        background: #474544;
        color: #f2f3eb;
    }

    form,
    table {
        padding: 37.5px;
    }

    table {
        width: 90%;
    }

    tr {
        text-align: left;
    }

    input,
    select {
        background: none;
        border: none;
        border-bottom: solid 2px #474544;
        color: #474544;
        font-size: 1em;
        font-weight: 400;
        letter-spacing: 1px;
    }
</style>