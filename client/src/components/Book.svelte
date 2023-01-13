<script>
    export let book

    import { Link, Router } from 'svelte-navigator'

</script>


<Router primary={false}>
    <div class="bookDiv">
        <Link to="/book/{book.id}"> <img src="{book.img}" alt="book cover"></Link>
        <br>
        <Link to="/book/{book.id}"><p>{book.title}</p></Link>
        <br>
            {#each book.authors as author, index}
                <Link to="/authors/{author.id}/books">
                    <p id="authors">{author.name}
                    {#if index < (book.authors.length-1)}, 
                    {/if}
                    </p>
                </Link>
            {/each}
    </div>
</Router> 

<style>
    .bookDiv img {
        height: 250px;
        display: block;
        width: 50%;
        margin-left: auto;
        margin-right: auto;
    }

    .bookDiv {
        margin-bottom: 20px;
        margin-left: 20px;
        margin-right: 20px;
    }

    .bookDiv p {
        text-align: center;
        font-size: 20px;
    }

    #authors {
        margin: auto;
    }

</style>