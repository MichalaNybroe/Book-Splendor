<script>
    import Book from '../components/Book.svelte'
    import { BASE_URL } from '../store/globals.js'
    import * as Toastr from 'toastr'
    import '../../node_modules/toastr/build/toastr.css'

    export let id
    export let endpoint
    
    let books = []

    async function fetchBooks() {
        try {
            const response = await fetch(`${$BASE_URL}/api/${endpoint}/${id}`, {
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