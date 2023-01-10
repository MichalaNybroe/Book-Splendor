<script>
    export let book

    import { Link, Router } from 'svelte-navigator'

</script>


<Router primary={false}>
    <Link to="/book/{book.id}"> 
        <div class="flex-container">
            <div class="flex-child">
                <img src="{book.img}" alt="book cover">
                <br>
                    {book.title}
                <br>
                    {#each book.authors as author, index}
                        <Link to="/authors/{author.id}/books">{author.name}
                            {#if index < (book.authors.length-1)}, 
                            {/if}
                        </Link>
                    {/each}
            </div>
        </div>
    </Link>
</Router> 

<style>
    img {
        height: 200px;
    }
</style>