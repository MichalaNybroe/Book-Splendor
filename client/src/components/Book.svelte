<script>
    export let book

    import { Link, Router } from 'svelte-navigator'
    import Author from './Author.svelte'
</script>

<!--
<Router primary={false}>
    <Link to="/book"><img src="{book.img}"></Link>
    <Link to="/book"><h3>{book.title}</h3></Link>
    {#each authors as author}
        <Link to="/authors/books"><Author author={author}/></Link>
    {/each}
</Router>
-->

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

    table {
        display: flex;
    flex-wrap: wrap;
    }

    td {
        width: 20%;
    }
    
    .flex-container {
    display: flex;
    flex-wrap: wrap;
    }

    .flex-child {
        min-width: 50%;
    }

</style>