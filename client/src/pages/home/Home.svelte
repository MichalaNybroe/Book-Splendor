<script>
    import Book from '../../components/Book.svelte'
    import CarouselBook from '../../components/CarouselBook.svelte'
    import { BASE_URL } from '../../store/globals'
    import * as Toastr from 'toastr'
    import '../../../node_modules/toastr/build/toastr.css'
    import Carousel from 'svelte-carousel'
    import PageHeader from '../../components/PageHeader.svelte'

    //Genres
    let romanceBooks = []
    let highFantasyBooks = []
    let sciFiBooks = []

    async function fetchRomanceBooks() {
        try {
            const response = await fetch(`${$BASE_URL}/api/genres/3`, {
                credentials: 'include',
            })

            if (response.ok) {
                const data = await response.json()
                romanceBooks = data.data
                romanceBooks = romanceBooks
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 5)
            } else {
                const data = await response.json()
                Toastr.warning(data.message)
            }
        } catch {
            Toastr.error('Unable to retrieve books. Try again later.')
        }
    }

    async function fetchHighFantasyBooks() {
        try {
            const response = await fetch(`${$BASE_URL}/api/genres/1`, {
                credentials: 'include',
            })

            if (response.ok) {
                const data = await response.json()
                highFantasyBooks = data.data;
                highFantasyBooks = highFantasyBooks
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 5)
            } else {
                const data = await response.json()
                Toastr.warning(data.message)
            }
        } catch {
            Toastr.error('Unable to retrieve books. Try again later.')
        }
    }
    async function fetchSciFiBooks() {
        try {
            const response = await fetch(`${$BASE_URL}/api/genres/5`, {
                credentials: 'include',
            })

            if (response.ok) {
                const data = await response.json()
                sciFiBooks = data.data
                sciFiBooks = sciFiBooks
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 5)
            } else {
                const data = await response.json()
                Toastr.warning(data.message)
            }
        } catch {
            Toastr.error('Unable to retrieve books. Try again later.')
        }
    }

    fetchRomanceBooks()
    fetchHighFantasyBooks()
    fetchSciFiBooks()

 
    //CAROUSEL
    export let timingFunction = 'ease-in-out'
    export let arrows = false
    export let infinite = true
    export let initialPageIndex = 1
    export let duration = 500
    export let autoplay = true
    export let autoplayDuration = 8000
    export let autoplayDirection = 'next'
    export let pauseOnFocus = false
    export let autoplayProgressVisible = false
    export let dots = true
    export let swiping = true
    export let particlesToShow = 1
    export let particlesToScroll = 1

    //FETCH BOOK OF THE WEEK

    async function fetchRecommendations() {
        try {
            const response = await fetch(`${$BASE_URL}/api/books/recommendations`, {
                credentials: 'include',
            })

            const data = await response.json()
                const recommendedBooks = data.data
                return recommendedBooks
        } catch {
            Toastr.error('Unable to retrieve books. Try again later.')
        }
    }

</script>
{#await fetchRecommendations()}
    <p>Loading...</p>
{:then recBooks} 
        <!--BOOK OF THE WEEK CAROUSEL-->
    <PageHeader header={"Books of the week"}></PageHeader>

    <div class="main-container">
        <Carousel  
            {timingFunction}
            {arrows}
            {infinite}
            {initialPageIndex}
            {duration}
            {autoplay}
            {autoplayDuration}
            {autoplayDirection}
            {pauseOnFocus}
            {autoplayProgressVisible}
            {dots}
            {swiping}
            {particlesToShow}
            {particlesToScroll}
        >
            {#each recBooks as book (book)}
                <div 
                    class="color-container">
            
                    <CarouselBook carouselbook={book}></CarouselBook>
                
                </div>
            {/each}
        </Carousel>
    </div>



    <!--GENRES-->
    <h2>Romance</h2>
        <div class="genres">
            {#each romanceBooks as book, i}
                <h5><Book {book} /></h5>
            {/each}
        </div>

    <h2>High Fantasy</h2>
        <div class="genres">
            {#each highFantasyBooks as book, i}
                <h5><Book {book} /></h5>
            {/each}
        </div>
    <h2>Sci-fi</h2>
        <div class="genres">
            {#each sciFiBooks as book, i}
                <h5><Book {book} /></h5>
            {/each}
        </div>
{/await}



<style>
    h5 {
        width: 20%;
    }

    h2 {
        margin-bottom: 3%;
        margin-top: 2%;
    }

    .genres {
        width: 100%;
        display: flex;
        margin-bottom: 5%;
    }

    .main-container {
        height: 100%;
        margin-bottom: 3%;
    }
</style>
