<script>
    import * as Toastr from 'toastr'
    import '../../../node_modules/toastr/build/toastr.css'
    import { BASE_URL } from '../../store/globals.js'
    import { Link } from 'svelte-navigator'
    import Author from '../../components/Author.svelte'
    import Genres from '../../components/Genres.svelte'
    import Series from '../../components/Series.svelte'

    let book = {}

    async function getBook() {
        const location = window.location
        console.log(location)

        try {
            const response = await fetch(`${$BASE_URL}/api/books/${book.id}`, {
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            })

            if (response.ok) {
                const data = await response.json()
                book = data.data
            } else {
                Toastr.warning('Unable to retrieve book.')
            }
        } catch {
            Toastr.error('Unable to retrieve book. Try again later.')
        }
    }

    getBook()
</script>



<img id="bookCover" src="{book.img}" alt="Book cover.">
hej
<h3>{book.title}</h3>
<!--<Link to="/series/books"><p>{series.title} {book.number}</p></Link>
<h4>Authors</h4>
{#each authors as author}
    <Link to="/authors/books"><Author author={author}/></Link>
{/each}
<h4>Genres</h4>
{#each genres as genre}
    <Link to="/genres/books"><Genres genre={genre}/></Link>
{/each}
<p>{book.unreleased}</p>-->
<!--<p>{book.rating}</p>
<p>{book.ratings} {reviews} Gør clickable så man kan se 5 af gangen evt graf</p>-->
<h4>Description</h4>
<p>{book.description}</p>


<p>anbefal</p>

<p>Create review/rating</p>