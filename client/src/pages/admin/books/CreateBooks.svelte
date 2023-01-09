<script>
    import { user } from '../../../store/auth.js'
    import { useNavigate } from 'svelte-navigator'
    import { BASE_URL } from '../../../store/globals.js'
    import * as Toastr from 'toastr'
    import '../../../../node_modules/toastr/build/toastr.css'
    import MultiSelect from 'svelte-multiselect'
    import Button from '../../../components/Button.svelte'
    
    if($user?.admin !== true) {
        const navigate = useNavigate()

        navigate('/')
    }

    const navigate = useNavigate();
    
    let selectedAuthors = []
    let selectedGenres = []
    let selectedSeries = []
    let genres = []
    let series = []
    let authors = []

    async function get(endpoint) {
        let array = []
        try {
            const response = await fetch(`${$BASE_URL}/api/${endpoint}`, {
                credentials: 'include'
            })
            if (response.ok) {
                const data = await response.json()
                return array = data.data
            } else {
                Toastr.warning(`Unable to retrieve ${endpoint}.`)
            }
        } catch {
            Toastr.error('Unable to retrieve data. Please try again later.')
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
        <br>
        <input type="text" placeholder="Title" name="title" id="title" bind:value={title} required>
    </div>
    <br>
    <div class="number">
        <label for="number">Number</label>
        <br>
        <input type="number" placeholder=1 name="number" id="number" min=1 bind:value={number} required>
    </div>
    <br>
    <div class="multiselect">
        <label for="series">Series</label>
        <MultiSelect bind:selected={selectedSeries} options={series} loading={series.length===0} maxSelect={1} name="series" id="series"/>
    </div>
    <br>
    <div class="multiselect">
        <label for="authors">Authors</label>
        <MultiSelect bind:selected={selectedAuthors} options={authors} loading={authors.length===0} minSelect={1} name="authors" required/>
    </div>
    <br>
    <div class="description">
        <label for="description">Description</label>
        <br>
        <textarea name="description" placeholder="Description" id="description" cols="30" rows="5" bind:value={description} required/>
      </div>
    <br>
    <div class="book_img">
        <label for="book_img">Image</label>
        <br>
        <input type="text" placeholder="Image" name="img" id="book_img" bind:value={book_img} required>
    </div>
    <br>
    <div class="multiselect">
        <label for="genres">Genres</label>
        <MultiSelect bind:selected={selectedGenres} options={genres} loading={genres.length===0} minSelect={1} name="genres" required/>
    </div>
    <br>
    <div class="releaseStatus">
        <label for="unreleased">Unreleased</label>
        <input bind:checked={unreleased} type="checkbox" name="unreleased" id="unreleased">        
    </div>
    <br>
    <div class="submit">
        <Button class="create">Create Book</Button>
    </div>
</form>
<br>

<p>
<Button class="goback" on:click={() => navigate(-1)}>Go back</Button>
</p>

<style>
    form {
        margin-left: 5%;
    }

    p {
        margin-left: 5%;
    }

    input {
        width: 50%;
        font-family: Georgia, 'Times New Roman', Times, serif;
    }

    textarea {
        overflow: auto;
        width: 50%;
        height: 150px;
        resize: none;
        font-family: Georgia, 'Times New Roman', Times, serif;
    }

    .multiselect {
        width: 51%
    }

    #number {
        height: 23px
    }

    
    #book_img {
        height: 23px
    }
    
    #title {
        height: 23px
    }

    .releaseStatus {
        width: 20%;
    }

</style>