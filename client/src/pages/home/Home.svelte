<script>
    import Book from "../../components/Book.svelte";
    import { BASE_URL } from "../../store/globals";
    import * as Toastr from "toastr";
    import "../../../node_modules/toastr/build/toastr.css";
    import Carousel from 'svelte-carousel';

    //Genres
    let romanceBooks = [];
    let highFantasyBooks = [];
    let sciFiBooks = [];

    async function fetchRomanceBooks() {
        try {
            const response = await fetch(`${$BASE_URL}/api/genres/3`, {
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                romanceBooks = data.data;
                romanceBooks = romanceBooks
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 5);
            } else {
                const data = await response.json();
                Toastr.warning(data.message);
            }
        } catch {
            Toastr.error("Unable to retrieve books. Try again later.");
        }
    }

    async function fetchHighFantasyBooks() {
        try {
            const response = await fetch(`${$BASE_URL}/api/genres/1`, {
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                highFantasyBooks = data.data;
                highFantasyBooks = highFantasyBooks
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 5);
            } else {
                const data = await response.json();
                Toastr.warning(data.message);
            }
        } catch {
            Toastr.error("Unable to retrieve books. Try again later.");
        }
    }
    async function fetchSciFiBooks() {
        try {
            const response = await fetch(`${$BASE_URL}/api/genres/5`, {
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                sciFiBooks = data.data;
                sciFiBooks = sciFiBooks
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 5);
            } else {
                const data = await response.json();
                Toastr.warning(data.message);
            }
        } catch {
            Toastr.error("Unable to retrieve books. Try again later.");
        }
    }

    fetchRomanceBooks();
    fetchHighFantasyBooks();
    fetchSciFiBooks();

 
    //Books of the week
    
    export let timingFunction = 'ease-in-out';
    export let arrows = false;
    export let infinite = true;
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

    const colors = [
        { color: '#e5f9f0', text: '0' },
        { color: '#ccf3e2', text: '1' },
        { color: '#b2edd3', text: '2' }
    ]

    //FETCH BOOK OF THE WEEK
    let currentIndex = 0;
    let weeklyBooks = ['test', 'test2', 'test3'];


    async function fetchBooksOfTheWeek() {
        try {
            const response = await fetch(`${$BASE_URL}/api/books/choices`, {
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                romanceBooks = data.data;
                romanceBooks = romanceBooks
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 5);
            } else {
                const data = await response.json();
                Toastr.warning(data.message);
            }
        } catch {
            Toastr.error("Unable to retrieve books. Try again later.");
        }
    }

</script>

<!--BOOK OF THE WEEK CAROUSEL-->
<h3>Books of the Week</h3>

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
      {#each colors as { color, text } (color)}
        <div
          class="color-container"
          style="background-color: {color};"
        >
          <p>{text}</p>
        </div>
      {/each}
    </Carousel>
  </div>



<!--GENRES-->
<h4>Romance</h4>
    <div class="genres">
        {#each romanceBooks as book, i}
            <h5><Book {book} /></h5>
        {/each}
    </div>

<h4>High Fantasy</h4>
    <div class="genres">
        {#each highFantasyBooks as book, i}
            <h5><Book {book} /></h5>
        {/each}
    </div>
<h4>Sci-fi</h4>
    <div class="genres">
        {#each sciFiBooks as book, i}
            <h5><Book {book} /></h5>
        {/each}
    </div>

<style>
    h5 {
        width: 20%;
    }

    .genres {
        width: 100%;
        display: flex;
    }

    .main-container {
        height: 50%;
    }

    .color-container {
        height: 50vh;
    }
</style>
