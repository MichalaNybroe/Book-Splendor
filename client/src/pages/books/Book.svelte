<script>
    export let book
    export let authors
    export let genres
    export let series

    import { Link } from 'svelte-navigator'
    import Author from '../../components/Author.svelte'
    import Genres from '../../components/Genres.svelte'
    import Series from '../../components/Series.svelte'
</script>



<img id="bookCover" src="{book.img}">
<h3>{book.title}</h3>
<Link to="/series/books"><p>{series.title} {book.number}</p></Link>
{#each authors as author}
    <Link to="/authors/books"><Author author={author}/></Link>
{/each}
{#each genres as genre}
    <Link to="/genres/books"><Genres genre={genre}/></Link>
{/each}
<p>{book.unreleased}</p>
<!--<p>{book.rating}</p>
<p>{book.ratings} {reviews} Gør clickable så man kan se 5 af gangen evt graf</p>-->
<p>{book.description}</p>


<p>anbefal</p>

<p>Create review/rating</p>