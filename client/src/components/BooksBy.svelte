<script>
    import Book from '../components/Book.svelte'
    import { BASE_URL } from '../store/globals.js'
    import * as Toastr from 'toastr'
    import '../../node_modules/toastr/build/toastr.css'
    import PageHeader from '../components/PageHeader.svelte'

    export let id
    export let endpoint

    async function fetchBooks() {
        try {
            const response = await fetch(`${$BASE_URL}/api/${endpoint}/${id}`, {
                credentials: 'include'
            })

            if(response.ok) {
                const data = await response.json()
                const books = data.data
                console.log(books)
                return books
            } else {
                const data = await response.json()
                Toastr.warning(data.message)
            }
        } catch {
            Toastr.error('Unable to retrieve books. Try again later.')
        } 
    }
</script>

{#await fetchBooks()}
    <p>Loading...</p>
{:then books} 
    
    <br>

    <div>
        {#if endpoint === 'genres'}
            <PageHeader header={`Books in ${books[0].genres[0].name} Genre`}></PageHeader>
        {:else if endpoint === 'authors'}
            <PageHeader header={'Books by Author'}></PageHeader>
        {:else}
        <PageHeader header={`Books in ${books[0].series_title}`}></PageHeader>
        {/if}

        <br>
        {#each books as book, i}
            <h5><Book book={book}></Book></h5>
            {#if i % 5 === 0}
                <br>
            {/if}
        {/each}
    </div>
{/await}

<style>
    div {
        width: 100%;
        display: flex;
        flex-wrap: wrap; 
    }  

    h5 {
        width: 20%;
    }

</style>