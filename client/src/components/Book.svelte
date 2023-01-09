<script>
    export let authors
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
<table>
    <div class="flex-container">
        <div class="flex-child">
            <td><Link to="/book"><img src="{book.img}" alt="book cover"></Link></td>
            <br>
            <td>{book.title}</td>
            <br>
            <td>{book.authors.map((author) => author.name).join(', ')}</td>
        </div>
    </div>
</table>
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