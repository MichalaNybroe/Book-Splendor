<script>
    export let carouselbook

    import { Link, Router } from 'svelte-navigator'
    import StarRating from 'svelte-star-rating'

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
                {#if !carouselbook.series_id}
                {:else}
                    <h3><Link to="/series/{carouselbook.series_id}/books">{carouselbook.series_title} {carouselbook.number}</Link></h3>
                {/if}
                <br>
                {#each carouselbook.authors as author, index}
                    <Link to="/authors/{author.id}/books">{author.name}
                        {#if index < (carouselbook.authors.length-1)}, 
                        {/if}
                    </Link>
                {/each}
                <br>
                    
                {#if !carouselbook.average_rating}
                <br>
                {:else}
                <br>
                <StarRating rating={carouselbook.average_rating}></StarRating>
                {/if}

                <p>{carouselbook.description}</p>
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
        width: 400px;
    }
</style>