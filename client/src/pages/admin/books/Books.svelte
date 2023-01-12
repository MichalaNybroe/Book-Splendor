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
    

    // BOOK OF THE WEEK
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
    // END OF BOOK OF THE WEEK

    const searchIdInput = ''
    const searchAuthorInput = ''
    const searchTitleInput = ''
    let searchForm
    let sortBooks = ''
    let searchId = ''
    let searchAuthor = ''
    let searchTitle = ''
    let books = []
    let columns = ['Id', 'Title', 'Number', 'Series', 'Authors', 'Genres', 'Recommend' ,'Update', 'Delete']
    let sortBooksDropDown = ['date', 'series', 'unreleased']
    let selected = ''

    
    async function retrieveBooks() {
       // søg med parametre
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

    //SEARCH BOOKS
    async function searchBooks(parameters) {
    // Build the query string from the search parameters
    let queryString = '';
    for (let param in parameters) {
        queryString += `${param}=${parameters[param]}&`;
    }
    try {
        // Send a GET request to the server with the search parameters in the query string
        const response = await fetch(`${$BASE_URL}/api/books?${queryString}`, {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const data = await response.json();
            books = data.data;
        } else {
            Toastr.warning('Unable to retrieve books.');
        }
    } catch {
        Toastr.error('Unable to retrieve books. Try again later.');
    }
}
 /*    async function retrieveBooks() {
    const searchId = searchIdInput.value;
    const searchAuthor = searchAuthorInput.value;
    const searchTitle = searchTitleInput.value;
    try {
        const response = await fetch(`${$BASE_URL}/api/books/search?searchId=${searchId}&searchAuthor=${searchAuthor}&searchTitle=${searchTitle}`, {
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
    }  */
  /*   async function searchBooks() {
        const selected = searchForm.elements.sortBooksDropDown.value;
        const searchId = searchForm.elements.search_books_id.value;
        const searchAuthor = searchForm.elements.search_books_author.value;
        const searchTitle = searchForm.elements.search_books_title.value;
        const data = { selected, searchId, searchAuthor, searchTitle };
        console.log(data)
        try {
            const response = await fetch("/api/books/search", {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const json = await response.json()
            console.log(json)
        } catch {
            Toastr.error('Unable to search for books. Try again later.')
        }
    }
 */

	
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

    retrieveBooks()
</script>

<p>
<Router primary={false}>
    <Link to="/admin/books/create">Create Book</Link>
</Router>
</p>

<!--SEARCH BOOKS-->
<form id="searchBooksForm" bind:this={searchForm} on:submit|preventDefault={searchBooks}>
    <label for="sortBooksDropDown">Sort by</label>
    <select name="sortBooksDropDown" bind:value={selected}>
        {#each sortBooksDropDown as value}
            <option {value}>{value}</option>
        {/each}
    </select>

    <label for="search_books_id">Id</label>
    <input type="number" name="search_books_id" id="search_books_id" bind:value={searchId}>

    <label for="search_books_author">Author</label>
    <input type="text" name="search_books_author" id="search_books_author" bind:value={searchAuthor}>

    <label for="search_books_title">Title</label>
    <input type="text" name="search_books_title" id="search_books_title" bind:value={searchTitle}>

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