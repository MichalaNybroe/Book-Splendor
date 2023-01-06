<script>
    export let authors
    export let book

    import { Link } from 'svelte-navigator'
    import Author from './Author.svelte'
</script>



<Link to="/book"><img src="{book.img}"></Link>
<Link to="/book"><h3>{book.title}</h3></Link>
{#each authors as author}
    <Link to="/authors/books"><Author author={author}/></Link>
{/each}


<style>
    img {
        height: 200px;
    }

</style>