<script>
    import { user } from '../../../store/auth.js'
    import { useNavigate } from 'svelte-navigator'
    import { BASE_URL } from '../../../store/globals.js'
    import * as Toastr from 'toastr'
    import '../../../../node_modules/toastr/build/toastr.css'
    import MultiSelect from 'svelte-multiselect'
    import Button from '../../../components/Button.svelte'
    import PageHeader from '../../../components/PageHeader.svelte'
    
    const navigate = useNavigate()

    if($user?.admin !== true) {
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




    // Utiil Mode 
    let utilMode = false

    async function enterUtilMode() {
        utilMode = true
    }

    async function exitUtilMode() {
        fetchInfo()
        utilMode = false
    }

    let selectedOption = []
    let options = ['Serie', 'Author', 'Genre']
    let newData = ''

    async function handleUtilSubmit() {
        let body

        if (selectedOption[0] === 'Serie') {
            body = { title: newData }
        } else {
            body = { name: newData }
        }
        
        try {
            const response = await fetch(`${$BASE_URL}/api/${selectedOption[0]}s`, {
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
            Toastr.success(`${selectedOption[0]} created.`)
        } catch {
            Toastr.error(`Unable to create ${selectedOption[0]}. Try again later.`)
            return
        }
    }

</script>

<div class="center-container">
{#if utilMode === false}
    <PageHeader header={'Create Book'}></PageHeader>
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

    <div id="buttonDiv">
        <h3>Create Util for Book</h3>
        <p><Button class="create" on:click={enterUtilMode}>UtilMode</Button></p>
        <br>
        <p><Button class="goback" on:click={() => navigate(-1)}>Go back</Button></p>
    </div>
    

    
{:else}
<PageHeader header={'Create Book Util'}></PageHeader>
    <div id="util">
        <form on:submit|preventDefault={handleUtilSubmit}>
            <label for="util">Choose Util to Create</label>
            <div class="multiselect">
                <MultiSelect bind:selected={selectedOption} options={options} loading={options.length===0} maxSelect={1} required name="util"></MultiSelect>
            </div>
            <br>
            <label for="input">Enter name or title</label>
            <br>
            <input type="text" placeholder="Lord of the Rings" bind:value={newData} required name="input">
            <br>
    
            <Button class="create">Create {!selectedOption ? 'Element' : selectedOption}</Button>
        </form>
        <p>
        <Button class="goback" on:click={exitUtilMode}>Back to Book</Button>
        </p>
    </div>
{/if}

</div>

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
        width: 50.5%;
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

    .center-container {
        display: grid;
        grid-template-columns: 20% 80% 20%;
    }

    #buttonDiv {
        grid-column: 2;
        grid-row: 2;
        margin-top: 80px;
        align-items: center;
    }

    #buttonDiv h3 {
        margin-bottom: 20px;
    }

    #util {
        margin-bottom: 400px;
    }

    #util label {
        font-size: 20px;
    }

    #util input {
        height: 23px
    }

</style>