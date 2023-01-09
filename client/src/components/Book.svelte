<script>
    export let book

    import { Link, Router } from 'svelte-navigator'
    import Author from './Author.svelte'
</script>

<Router primary={false}>
    <Link to="/book/{book.id}">
        <table>
          
        <div class="flex-container">
            <div class="flex-child">
                
                <td><img src="{book.img}" alt="book cover"></td>
                <br>
                <td>{book.title}</td>
                <br>
                <td>
                    {#each book.authors as author, index}
                        <Link to="/authors/{author.id}/books">{author.name}
                            {#if index < (book.authors.length-1)}, 
                            {/if}
                        </Link>
                    {/each}
                </td>

            </div>

</div>
    </table>
    </Link>
</Router>

<style>
    img {
        height: 200px;
    }

    .flex-child {
        min-width: 200px;
    }
</style>