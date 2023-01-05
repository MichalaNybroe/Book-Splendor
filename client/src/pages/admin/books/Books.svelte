<script>
    import { Router, Link, useNavigate } from 'svelte-navigator'
    import { BASE_URL } from '../../../store/globals.js'
    import { user } from '../../../store/auth'
    import * as Toastr from 'toastr'
    import '../../../../node_modules/toastr/build/toastr.css'


    if($user?.admin !== true) {
        const navigate = useNavigate()

        navigate('/')
    }

    let sortBooks = ''
    let searchId = ''
    let searchAuthor = ''
    let searchTitle = ''
    let books = []
    let columns = ['Id' , 'Title', 'Number', 'Series', 'Authors', 'Genres']
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
                Toastr.warning("Unable to retrieve books.")
            }
        } catch {
            Toastr.error('Unable to retrieve books. Try again later.')
        }
        
    }
	
	async function deleteBook(book) {
        try {
            //confirm message before try 'Are you sure you wish to delete' TOASTR
            const response = await fetch(`${$BASE_URL}/api/users/${book.id}`, {
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
            Toastr.error('Unable to delete user. Try again later.')
	    }
    }

    retrieveBooks()
</script>

<Router primary={false}>
    <Link to="/admin/books/create">Create Book</Link>
</Router>

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

    <input type="submit" value="Search">
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
			<td>{book.series_id ?? ''}</td>
			<td>{book.authors.map((author) => author.name).join(', ')}</td>
            <!--<td>{book.genres.map((genre) => genre.name).join(', ')}</td>-->
            <Link to="/admin/books/{book.id}/edit" style="color:black">Update</Link>
			<button on:click={() => deleteBook(book)}>
				X
			</button>
		</tr>
	{/each}
</table>

<style>
</style>