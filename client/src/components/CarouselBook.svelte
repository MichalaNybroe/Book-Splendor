<script>
    export let carouselbook

    import { Link, Router } from 'svelte-navigator'

</script>


<Router primary={false}>
    <Link to="/book/{carouselbook.id}"> 
        <div class="flex-container">
            <div class="flex-child">
                <img src="{carouselbook.img}" alt="book cover">
            </div>
            <div class="flex-child">
                    <h3>{carouselbook.title}</h3>
                    <br>
                    {carouselbook.series_title}
                    <br>
                    {carouselbook.average_rating}
                <br>
                    {#each carouselbook.authors as author, index}
                        <Link to="/authors/{author.id}/books">{author.name}
                            {#if index < (carouselbook.authors.length-1)}, 
                            {/if}
                        </Link>
                    {/each}
                    <br>

            </div>
        </div>
    </Link>
</Router> 

<style>
    img {
        height: 500px;
    }

    .flex-container {
     display: inline-block;
    }

    .flex-child {
        display: inline-block;
    }
</style>