<script>
    import { user } from "../../../store/auth.js"
    import { useNavigate } from "svelte-navigator"
    import { BASE_URL } from "../../../store/globals.js"
    import * as Toastr from "toastr"
    import CheckboxGenres from "../../../components/CheckboxGenres.svelte"
    import CheckboxSeries from "../../../components/CheckboxSeries.svelte"
    import CheckboxAuthors from "../../../components/CheckboxAuthors.svelte"
    import { onMount } from "svelte";

    
    if($user?.admin !== true) {
        const navigate = useNavigate()

        navigate("/")
    }

    let genres = []
    let series = []
    let authors = []

    async function get(endpoint) {
        let array = []
        const response = await fetch(`${$BASE_URL}/api/${endpoint}`, {
            credentials: "include"
        })
        if (response.ok) {
            const data = await response.json()
            return array = data.data
        } else {
            Toastr.warning(`Unable to retrieve ${endpoint}.`)
        }
    }
   
async function fetchInfo() {
    series = await get("series")
    genres = await get("genres")
    authors = await get("authors")
}


onMount(fetchInfo)


async function handleSubmit() {
    const body = {
      title: title,
      description: description,
      number: number,
      series_id: series,
      unreleased: unreleased,
      img: book_img,
      authors: authors,
      genres: genres
    }
}

let title = ""
let description = ""
let number = ""
let unreleased = ""
let book_img = ""

</script>

<!--
<form on:submit|preventDefault={handleSubmit}
id="create_book_form"
method="POST"
action="/createbook">

<div class="title">
    <label for="title" />
    <input type="text" placeholder="Title" name="title" id="title" bind:value{title}>
</div>
<div class="description">
    <label for="description" />
    <input type="text" placeholder="Description" name="description" id="description" bind:value{description}>
</div>
<div class="number">
    <label for="number" />
    <input type="number" placeholder=1 name="number" id="number" min=1 bind:value{number}>
</div>
<div class="series">
    {#each series as serie}
        <CheckboxSeries serie={serie}></CheckboxSeries>
    {/each}
</div>
<div class="Release status">
    <input type="checkbox" name="unreleased" id="unreleased" bind:value{unreleased}>
    <label for="unreleased">Unreleased</label>
</div>
<div class="book_img">
    <label for="book_img" />
    <input type="text" placeholder="Image" name="img" id="book_img" bind:value{book_img}>
</div>
<div class="authors">
    {#each authors as author}
        <CheckboxAuthors author={author}></CheckboxAuthors>
    {/each}
</div>
<div class="genres">
    {#each genres as genre}
        <CheckboxGenres genre={genre}></CheckboxGenres>
    {/each}
</div>
<div class="submit">
    <input type="submit" value="Create book" id="submit_button" />
</div>
</form>
-->