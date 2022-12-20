<script>
    import { onMount } from "svelte"
    import { Router, Link, useNavigate } from "svelte-navigator"
    import { BASE_URL } from "../../../store/globals.js"
    import { user_admin } from "../../../store/auth"
    import * as Toastr from "toastr"
    import '../../../../node_modules/toastr/build/toastr.css'


    if($user_admin === null) {
        const navigate = useNavigate()

        navigate("/")
    }

    onMount(() => {

        //pick what to send / make check on what is filled out
        const form = document.getElementById("searchBooksForm")
        const sortBooks = document.getElementById("sortBooksDropDown")
        const searchId = document.getElementById("search_books_id")
        const searchAuthor = document.getElementById("search_books_author")
        const searchTitle = document.getElementById("search_books_title")
        

        form.addEventListener("submit", (event) => {
            event.preventDefault()

            const body = {
                sortBooks: sortBooks.value,
                searchId: searchId.value,
                searchAuthor: searchAuthor.value,
                searchTitle: searchTitle.value
            }

            return fetch(`${$BASE_URL}/api/books`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            }).then((response) => {
                    if (response.ok) {
                        Toastr.success("Message is received. Thank you for sending it!")
                    } else {
                        response.json().then((m) => Toastr.error(m.message))
                    }
                })
                .catch((message) => Toastr.error("Error. Try again later."))
        })
    })

    // fetch => fill list of books + notifcations if unable
      

</script>

<Router primary={false}>
    <Link to="/admin/books/create">Create Book</Link>
</Router>

<form id="searchBooksForm">
    <label for="sortBooksDropDown">Sort by</label>
    <select name="sortBooksDropDown" id="sortBooksDropDown">
        <option value="date">Newest</option>
        <option value="series">Series</option>
        <option value="unreleased">Unreleased</option>
    </select>

    <label for="search_books_id">Id</label>
    <input type="number" name="search_books_id" id="search_books_id">

    <label for="search_books_author">Author</label>
    <input type="text" name="search_books_author" id="search_books_author">

    <label for="search_books_title">Title</label>
    <input type="text" name="search_books_title" id="search_books_title">

    <input type="submit" value="Search">
</form>

<div id="listBooksAdmin">

</div>

