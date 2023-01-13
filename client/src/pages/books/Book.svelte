<script>
    import * as Toastr from 'toastr'
    import '../../../node_modules/toastr/build/toastr.css'
    import { BASE_URL } from '../../store/globals.js'
    import { user } from '../../store/auth.js'
    import { Link, Router } from 'svelte-navigator'
    import Author from '../../components/Author.svelte'
    import Genres from '../../components/Genres.svelte'
    import Button from '../../components/Button.svelte'
    import io from 'socket.io-client'
    import Review from '../../components/Review.svelte'
    import StarRating from 'svelte-star-rating'
    import { onDestroy } from 'svelte'

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


    // Rating

    // Socket
    let reviewsFromSocket = []
    const socket = io('ws://localhost:8080')
    socket.on(`Books.${id}`, (data) => {
        reviewsFromSocket.push(data)
        reviewsFromSocket = reviewsFromSocket
    })

    onDestroy(() => {
        socket.close()
    })



    // Leave a Rating
    async function leaveReview() {
        if (rating < 0 || rating > 5) {
            Toastr.warning('Rating has to be between 0 and 5.')
            return
        }

        if (subject.length > 50) {
            Toastr.warning('Subjectline can only be 50 characters long.')
            return
        }

        if (reviewText.length > 1000) {
            Toastr.warning('Review can only be 1000 characters long.')
            return
        }

        try {
            const userid = $user.id
            const body = { subject: subject, review: reviewText, rating: rating, bookId: id, userId: userid }
            const response = await fetch(`${$BASE_URL}/api/reviews`, {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })

        // Do we need this?
        if (!response.ok) {
            const json = await response.json()
            Toastr.warning(json.message)
            return
        }
            Toastr.success('Thank you for the review!.')
        } catch {
            Toastr.error(`Unable to give review. Try again later.`)
            return
        }
    }

    let rating = 0
    let subject = ''
    let reviewText = ''
</script>


<Router primary={false}>
    {#await getBook()}
        <p>Loading...</p>
    {:then book} 
            <img id="bookCover" src="{book.img}" alt="Book cover.">
            <h3>{book.title}</h3>
            {#if book.average_rating === null}
                <p>No reviews</p>
            {:else}
                <StarRating rating={book.average_rating}></StarRating>
            {/if}
            {#if book.series_id === null}
            {:else}
            <Link to="/series/{book.series_id}/books"><p>{book.series_title} {book.number}</p></Link>
            {/if}
            <h4>Authors</h4>
            {#each book.authors as author}
                <Link to="/authors/{author.id}/books"><Author author={author}/></Link>
            {/each}
            <h4>Genres</h4>
            {#each book.genres as genre}
                <Link to="/genres/{genre.id}/books"><Genres genre={genre}/></Link>
            {/each}
            {#if book.unreleased === 'Released'}
            {:else}
            <p>{book.unreleased}</p>
            {/if}
            <!-- <p>{book.unreleased ? 'Unreleased' : 'Released'}</p> -->
            <p>Ratings</p>
            {#each [...book.reviews, ...reviewsFromSocket].reverse().slice(0, 5) as review}
                <Review review={review}></Review>
            {/each}
            <h4>Description</h4>
            <p>{book.description}</p>


            {#if $user} 
            <form on:submit|preventDefault={leaveReview}>

            <h4>Give review!</h4>

            <label for="subject">Subjectline</label>
            <input type="text" name="subject" bind:value={subject} required max="50">
            <label for="review">Review</label>
            <textarea name="review" placeholder="My Review is..." cols="30" rows="5" required maxlength="1000" bind:value={reviewText}></textarea>
            <label for="ratingForm">Rating</label>
            <input type="number" min="0" max="5" name="ratingForm" bind:value={rating} required>

            <Button class="create">Leave Review</Button>

            </form>
            {/if}
    {/await}
</Router>