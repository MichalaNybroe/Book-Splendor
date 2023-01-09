<script>
    import Book from '../../components/Book.svelte'
    import { BASE_URL } from '../../store/globals'
    import * as Toastr from 'toastr'
    import '../../../node_modules/toastr/build/toastr.css'
    import { Link } from 'svelte-navigator';


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
           
            
            
            {/each}
        </tr>
   
        
</table>

<thead>
    <tr>
      <th>
        {#each books as book}
        <Link to="/book"><img src="{book.img}"></Link>    
        {/each}
      </th>
    </tr>
  </thead>
  <tbody>
    {#each books as book}
    <tr>
        <td>{book.title}</td>
    </tr>
    <tr>
        <td>{book.authors.map((author) => author.name).join(', ')}</td>
            
    </tr>
  </tbody>


<!--
<table> 
    <tr>
        {#each books as book}
            <td><h5><Book book={book} authors={book.authors}></Book></h5></td>
        {/each}
    </tr>
</table>
-->

<style>
    table {
        width: 90%;
        margin-left: 5%;
    }
    
    td {
        width: 20px;
    }

    img {
        height: 200px;
    }
</style>