<script>
    import Book from '../../components/Book.svelte'
    import { BASE_URL } from '../../store/globals.js'
    import * as Toastr from 'toastr'
    import '../../../node_modules/toastr/build/toastr.css'
    import PageHeader from '../../components/PageHeader.svelte'

    let books = []

    async function fetchBooks() {
        try {
            const response = await fetch(`${$BASE_URL}/api/books`, {
                credentials: 'include'
            })

            if(response.ok) {
                const data = await response.json()
                books = data.data
            } else {
                const data = await response.json()
                Toastr.warning(data.message)
            }
        } catch {
            Toastr.error('Unable to retrieve books. Try again later.')
        } 
    }

    fetchBooks()
</script>

<PageHeader header={"Books"}></PageHeader>

<div class="book-container">
    {#each books as book, i}
    <h5><Book book={book}></Book></h5>
        
        {#if i % 5 === 0}
            <br>
        {/if}
    {/each}
</div>


<style>
    .book-container {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }

    h5 {
        width: 20%;
    }

</style>