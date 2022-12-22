<script>
    import Book from "../../components/Book.svelte"
    import { onMount } from "svelte"
    import { BASE_URL } from "../../store/globals"
    import * as Toastr from "toastr"
    import '../../../node_modules/toastr/build/toastr.css'


    let books = []
    let authors = ["Mike", "Silke"]

    async function fetchBooks() {
        const response = await fetch(`${$BASE_URL}/api/books`, {
            credentials: "include"
        })

        if(response.ok) {
            const data = await response.json()
            books = data.data
        } else {
            Toastr.warning("Unable to retrive books.")
        }
    }

    onMount(fetchBooks)
</script>

{#each books as book}
    <Book book={book} authors={authors}></Book>
{/each}