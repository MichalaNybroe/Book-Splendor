<script>
    import { onMount } from "svelte"
    import { Router, Link, useNavigate } from "svelte-navigator"
    import { BASE_URL } from "../../../store/globals.js"
    import { user } from "../../../store/auth"
    import * as Toastr from "toastr"
    import '../../../../node_modules/toastr/build/toastr.css'


    if($user?.admin !== true) { //nullable check
        const navigate = useNavigate()

        navigate("/")
    }

    let sortBooks = ""
    let searchId = ""
    let searchAuthor = ""
    let searchTitle = ""
    let books = []
    let columns = ["Id" ,"Title", "Description", "Number", "Image", "Series", "Authors", "Genres"]
    let sortBooksDropDown = ["date", "series", "unreleased"]
    let selected = ""

    
    async function retrieveBooks() {
        const body = {
            sortBooks: sortBooks.value,
            searchId: searchId.value,
            searchAuthor: searchAuthor.value,
            searchTitle: searchTitle.value
        }

        const response = await fetch(`${$BASE_URL}/api/books`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        })

        if (response.ok) {
            const data = await response.json()
            books = data.data.map((book) => Object.values(book))
        } else {
            Toastr.error("Unable to retrieve books.")
        }
    }
	
	function deleteBook(rowToBeDeleted) {
		books = books.filter(row => row != rowToBeDeleted)
	}

    function updateBook(rowToBeUpdated) {
        books = books.filter(row => row != rowToBeUpdated)
    }

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
	
	{#each books as row}
		<tr>
			{#each row as cell}
			<td contenteditable="true" bind:textContent={cell} />
			{/each}
            <button on:click={() => updateBook(row)}>
                Update
            </button>
			<button on:click={() => deleteBook(row)}>
				X
			</button>
		</tr>
	{/each}
</table>

<style>
</style>