<script>
    import Book from "../../components/Book.svelte";
    import { BASE_URL } from "../../store/globals";
    import * as Toastr from "toastr";
    import "../../../node_modules/toastr/build/toastr.css";

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

</script>

<h3>Book of the Week</h3>

<h4>Romance</h4>
    <div class="test">
        {#each romanceBooks as book, i}
            <h5><Book {book} /></h5>
        {/each}
    </div>

<h4>High Fantasy</h4>
    <div class="test">
        {#each highFantasyBooks as book, i}
            <h5><Book {book} /></h5>
        {/each}
    </div>
<h4>Sci-fi</h4>
    <div class="test">
        {#each sciFiBooks as book, i}
            <h5><Book {book} /></h5>
        {/each}
    </div>

<style>
    h5 {
        width: 20%;
    }

    .test {
        width: 100%;
        display: flex;
    }
</style>
