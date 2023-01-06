<script>
    import Book from '../../components/Book.svelte'
    import { BASE_URL } from '../../store/globals'
    import * as Toastr from 'toastr'
    import '../../../node_modules/toastr/build/toastr.css'


    let books = []
    let authors = []

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


<table> 
    <tr>
        {#each books as book}
            <td><h5><Book book={book} authors={book.authors}></Book></h5></td>
        {/each}
    </tr>
</table>



<!-- Jeg er en bangebuks der ikke tør slette det her endnu. Give me 24 hours and I promise I will 
{#each books as book}
    <Book book={book} authors={book.authors}></Book>
{/each}
-->

<style>
    table {
        width: 90%;
    }
    
    td {
        width: 20px;
    }
</style>