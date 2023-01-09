<script>
    import Book from '../../components/Book.svelte'
    import { BASE_URL } from '../../store/globals'
    import * as Toastr from 'toastr'
    import '../../../node_modules/toastr/build/toastr.css'
    import { Link } from 'svelte-navigator'


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
            <td><h5><Book book={book}></Book></h5></td>
        {/each}
    </tr>
</table>


<style>
    table {
        width: 90%;
        margin-left: 5%;  
    }  
</style>