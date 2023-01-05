<script>
    import { user } from '../../../store/auth.js'
    import { useNavigate } from 'svelte-navigator'
    import { BASE_URL } from '../../../store/globals.js'
    import * as Toastr from 'toastr'
    import '../../../../node_modules/toastr/build/toastr.css'
    import MultiSelect from 'svelte-multiselect'
    
    if($user?.admin !== true) {
        const navigate = useNavigate()

        navigate('/')
    }
    
    let selectedAuthors = []
    let selectedGenres = []
    let selectedSeries = []
    let genres = []
    let series = []
    let authors = []

    async function get(endpoint) {
        let array = []
        const response = await fetch(`${$BASE_URL}/api/${endpoint}`, {
            credentials: 'include'
        })
        if (response.ok) {
            const data = await response.json()
            return array = data.data
        } else {
            Toastr.warning(`Unable to retrieve ${endpoint}.`)
        }
    }
   
    async function fetchInfo() {
        series = await get('series')
        series = series.map((series) => ({
                label: series.title,
                id: series.id
        }))
        genres = await get('genres')
        genres = genres.map((genre) => ({
                label: genre.name,
                id: genre.id
        }))
        authors = await get('authors')
        authors = authors.map((author) => ({
                label: author.name,
                id: author.id
        }))
    }


    fetchInfo()

    let title = ''
    let description = ''
    let number = ''
    let unreleased = false
    let book_img = ''

    async function handleSubmit() {
        let seriesBody = ''

        if(selectedSeries.length === 0) {
            seriesBody = null
        } else {
            seriesBody = selectedSeries[0]
        }

        const body = {
        title: title,
        description: description,
        number: number,
        series: seriesBody,
        unreleased: unreleased,
        img: book_img,
        authors: selectedAuthors,
        genres: selectedGenres
        }

        try {
            const response = await fetch(`${$BASE_URL}/api/books`, {
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
            Toastr.success('Book created.')
        } catch {
            Toastr.error('Unable to create book. Try again later.')
            return
        }
    }
</script>


<form on:submit|preventDefault={handleSubmit}
id="create_book_form"
method="POST"
action="/createbook">

    <div class="title">
        <label for="title">Title</label>
        <input type="text" placeholder="Title" name="title" id="title" bind:value={title} required>
    </div>

    <div class="number">
        <label for="number">Number</label>
        <input type="number" placeholder=1 name="number" id="number" min=1 bind:value={number} required>
    </div>

    <label for="series">Series</label>
    <MultiSelect bind:selected={selectedSeries} options={series} loading={series.length===0} maxSelect={1} name="series"/>

    <label for="authors">Authors</label>
    <MultiSelect bind:selected={selectedAuthors} options={authors} loading={authors.length===0} minSelect={1} name="authors" required/>
    

    <div class="description">
        <label for="description">Description</label>
        <input type="text" placeholder="Description" name="description" id="description" bind:value={description} required>
    </div>

    <div class="book_img">
        <label for="book_img">Image</label>
        <input type="text" placeholder="Image" name="img" id="book_img" bind:value={book_img} required>
    </div>

    <label for="genres">Genres</label>
    <MultiSelect bind:selected={selectedGenres} options={genres} loading={genres.length===0} minSelect={1} name="genres" required/>

    <div class="Release status">
        <input bind:checked={unreleased} type="checkbox" name="unreleased" id="unreleased" >
        <label for="unreleased">Unreleased</label>
    </div>

    <div class="submit">
        <input type="submit" value="Create book" id="submit_button" />
    </div>
</form>
