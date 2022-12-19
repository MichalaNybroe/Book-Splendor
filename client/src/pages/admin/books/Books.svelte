<script>
    import { onMount } from "svelte"
    import { Router, Link, useNavigate } from "svelte-navigator"
    import { BASE_URL } from "../../../store/globals.js"
    import { user } from "../../../store/auth"
    import * as Toastr from "toastr"
    import '../../../../node_modules/toastr/build/toastr.css'

    if($user.admin !== true) {
        const navigate = useNavigate()

        navigate("/")
    }

    onMount(() => {

        //pick what to send / make check on what is filled out
        const form = document.getElementById("searchBooksForm")
        

        form.addEventListener("submit", (event) => {
            event.preventDefault()

            const body = {

            }


            // fetch => fill list of books + notifcations if unable
        })
    })

</script>

<Router primary={false}>
    <Link to="/admin/books/create"></Link>
</Router>
<a id="createBook" >Create Book</a>

<form id="searchBooksForm">
    <label for="sortBooksDropDown">Sort by</label>
    <select name="sortBooksDropDown" id="sortBooksDropDown">
        <option value="author">Author</option>
        <option value="date">Newest</option>
        <option value="series">Series</option>
        <option value="unreleased">Unreleased</option>
    </select>

    <label for="search_books_id">Id</label>
    <input type="number" name="search_books_id" id="search_books_id">

    <label for="search_books_title">Title</label>
    <input type="text" name="search_books_title" id="search_books_title">

    <input type="submit" value="Search">
</form>

<div id="listBooksAdmin">
</div>

