<script>
    import { Router, Link, useNavigate } from 'svelte-navigator'
    import { BASE_URL } from '../../../store/globals.js'
    import { user } from '../../../store/auth'
    import * as Toastr from 'toastr'
    import '../../../../node_modules/toastr/build/toastr.css'
    import Button from '../../../components/Button.svelte'


    if($user?.admin !== true) {
        const navigate = useNavigate()

        navigate('/')
    }

    const navigate = useNavigate();

    let sortBooks = ''
    let searchId = ''
    let searchAuthor = ''
    let searchTitle = ''
    let books = []
    let columns = ['Id', 'Title', 'Number', 'Series', 'Authors', 'Genres', 'Update', 'Delete']
    let sortBooksDropDown = ['date', 'series', 'unreleased']
    let selected = ''

    
    async function retrieveBooks() {
       // søg med paramtre
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
	
	async function deleteBook(book) {
        try {
            //confirm message before try 'Are you sure you wish to delete' TOASTR
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

<form id="searchBooksForm" on:submit|preventDefault={retrieveBooks}>
    <label for="sortBooksDropDown">Sort by</label>
    <select name="sortBooksDropDown" bind:value={selected}>
        {#each sortBooksDropDown as value}
            <option {value}>{value}</option>
        {/each}
    </select>

    <label for="search_books_id">Id</label>
    <input type="number" name="search_books_id" id="search_books_id">

    <label for="search_books_author">Author</label>
    <input type="text" name="search_books_author" id="search_books_author">

    <label for="search_books_title">Title</label>
    <input type="text" name="search_books_title" id="search_books_title">

    <button type="submit">Search</button>
    <!--<input type="submit" value="Search">-->
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
                <Link class="update" to="/admin/books/{book.id}/update">
                    <i class="fa fa-pencil"></i>
                </Link>
            </td>
            <td>
                <Button class="danger" on:click={()=> deleteBook(book)}>
                    <i class="w3-margin-left fa fa-trash"></i>
                </Button>
            </td>
		</tr>
	{/each}
</table>

<style>
    :global(body) {
        font-family: Georgia, 'Times New Roman', Times, serif;
        margin-left: 5%;
    }

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