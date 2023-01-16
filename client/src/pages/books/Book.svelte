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
    import PageHeader from '../../components/PageHeader.svelte'

    export let id

    async function getBook() {
        try {
            const response = await fetch(`${$BASE_URL}/api/books/${id}`, {
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            })

            if (response.ok) {
                const data = await response.json()
                const book = data.data[0]
                has_read = book.has_read
                want_to_read = book.want_to_read
                return book
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
            Toastr.success('Thank you for the review!')
        } catch {
            Toastr.error('Unable to leave review. Try again later.')
            return
        }
    }

    let rating = 0
    let subject = ''
    let reviewText = ''
    let has_read = 0
    let want_to_read = 0


    // Mark as has read
    async function setHasRead(book) {
        
        const body = {
            userid: $user.id,
            hasRead: has_read
        }

        try {
            const response = await fetch(`${$BASE_URL}/api/books/${book.id}/hasRead`, {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
        if (!response.ok) {
            const json = await response.json()
            Toastr.warning(json.message)
            return
        }
            Toastr.success('Book status updated.')
        } catch {
            Toastr.error('Unable to update book status. Try again later.')
            return
        }
    }


    // Mark as want to read
    async function setWantToRead(book) {

        const body = {
            userid: $user.id,
            wantToRead: want_to_read
        }

        try {
            const response = await fetch(`${$BASE_URL}/api/books/${book.id}/wantToRead`, {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
        if (!response.ok) {
            const json = await response.json()
            Toastr.warning(json.message)
            return
        }
            Toastr.success('Book status updated.')
        } catch {
            Toastr.error('Unable to update book status. Try again later.')
            return
        }
    }

</script>


<Router primary={false}>
    {#await getBook()}
        <p>Loading...</p>
    {:then book}
        <div id="book">
            <img id="bookCover" src="{book.img}" alt="Book cover.">

            <div id="bookInfo">
                <PageHeader header={book.title}></PageHeader>
                {#if !book.average_rating}
                    <p>No reviews</p>
                {:else}
                    <StarRating rating={book.average_rating} config={{size: 35}}></StarRating>
                {/if}
                {#if !book.series_id}
                {:else}
                    <h3><Link to="/series/{book.series_id}/books"><p>{book.series_title} {book.number}</p></Link></h3>
                {/if}

                <h4>Authors</h4>
                {#each book.authors as author}
                    <h3><Link to="/authors/{author.id}/books"><Author author={author}/></Link></h3>
                {/each}

                <h4>Genres</h4>
                {#each book.genres as genre}
                    <h3><Link to="/genres/{genre.id}/books"><Genres genre={genre}/></Link></h3>
                {/each}

                <p>{book.unreleased ? 'Unreleased' : ''}</p>
                <h4>Description</h4>
                <p>{book.description}</p>
                {#if $user && $user.admin === false}
                    <h4>Set status</h4>
                    <label>
                        <input type="checkbox" bind:checked={has_read} on:change={() => setHasRead(book)}>
                        Has read
                    </label>
                    <label>
                        <input type="checkbox" bind:checked={want_to_read} on:change={() => setWantToRead(book)}>
                        Want to read
                    </label>
                {/if}
            </div>
        </div>

        <div id="review">
            <h4>Reviews</h4>
            <div id="bookReviews">
                {#if book.reviews.length === 0 && reviewsFromSocket === 0}
                <h5>No reviews yet</h5>
                {:else}
                {#each [...book.reviews, ...reviewsFromSocket].reverse().slice(0, 5) as review}
                    <h5><Review review={review}></Review></h5>
                {/each}
                {/if}
            </div>


            {#if $user && $user.admin === false}
            <div id="leaveReview">
                <form on:submit|preventDefault={leaveReview}>

                <h4>Leave a review!</h4>

                <h3>Subjectline</h3>
                <input type="text" id="subject" name="subject" bind:value={subject} required max="50">
                <h3>Review</h3>
                <textarea name="review" id="reviewText" placeholder="My Review is..." cols="30" rows="5" required maxlength="1000" bind:value={reviewText}></textarea>
                <h3>Rating</h3> 
                <input type="number" min="0" max="5" name="ratingForm" bind:value={rating} required>
                <br>
                <Button class="create">Leave Review</Button>
                
                </form>
            </div>
            {/if}
        </div>
    {/await}
</Router>

<style>
    #bookReviews {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        gap: 2%;
    }

    h5 {
        width: 15%;
        border: 2px solid #EEE;
        padding: 10px;
    }

    #book img{
        height: 640px;
        margin-left: 100px; 
    }

    #book {
        display: flex;
        gap: 100px
    }

    #bookInfo  {
        margin: 50px 0 0 100px;
    }

    #bookInfo h4 {
        margin-top: 20px;
        font-size: 22px;
    }

    #review {
        margin: 70px 50px;
    }

    #review h4 {
        font-size: 22px;
        margin-bottom: 20px;
    }

    #leaveReview {
        margin-top: 50px;
        width: 34%;
    }

    h3 {
        margin-bottom: 5px;
        margin-top: 5px;
    }

    #subject {
        width: 100%;
    }

    #reviewText {
        overflow: auto;
        width: 100%;
        height: 150px;
        resize: none;
        font-family: Georgia, 'Times New Roman', Times, serif;
    }

</style>
