<script>
    import * as Toastr from 'toastr'
    import '../../../node_modules/toastr/build/toastr.css'
    import { BASE_URL } from '../../store/globals.js'
    import { Link, Router } from 'svelte-navigator'
    import Author from '../../components/Author.svelte'
    import Genres from '../../components/Genres.svelte'
    import Series from '../../components/Series.svelte'

    export let id

    async function getBook() {
        try {
            const response = await fetch(`${$BASE_URL}/api/books/${id}`, {
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            })

            if (response.ok) {
                const data = await response.json()
                return data.data
            } else {
                Toastr.warning('Unable to retrieve book.')
            }
        } catch {
            Toastr.error('Unable to retrieve book. Try again later.')
        }
    }  
</script>


<Router primary={false}>
    {#await getBook()}
        <p>Loading...</p>
    {:then book} 
            <img id="bookCover" src="{book.img}" alt="Book cover.">
            <h3>{book.title}</h3>
            <Link to="/series/{book.series_id}/books"><p>{book.series_title} {book.number}</p></Link>
            <h4>Authors</h4>
            {#each book.authors as author}
                <Link to="/authors/{author.id}/books"><Author author={author}/></Link>
            {/each}
            <h4>Genres</h4>
            {#each book.genres as genre}
                <Link to="/genres/{genre.id}/books"><Genres genre={genre}/></Link>
            {/each}
            <p>{book.unreleased ? 'Unreleased' : 'Released'}</p>
            <!--<p>{book.rating}</p>
            <p>{book.ratings} {reviews} Gør clickable så man kan se 5 af gangen evt graf</p>-->
            <h4>Description</h4>
            <p>{book.description}</p>

            <p>anbefal</p>

            <p>Create review/rating</p>
    {/await}
</Router>