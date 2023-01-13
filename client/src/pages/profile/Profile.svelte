<script>
    import { Router, Link, useNavigate } from 'svelte-navigator'
    import { user } from '../../store/auth.js'
    import * as Toastr from 'toastr'
    import '../../../node_modules/toastr/build/toastr.css'
    import { BASE_URL } from '../../store/globals.js'
    import Button from '../../components/Button.svelte'
    import MultiSelect from 'svelte-multiselect'
    import { Confirm } from 'svelte-confirm'
    import UsersReview from '../../components/UsersReview.svelte'
    import Book from '../../components/Book.svelte'
    import PageHeader from '../../components/PageHeader.svelte'
    
    const navigate = useNavigate()
    
    if (!$user || $user.admin === true) {
        navigate('/')
    }

    let pictureSelect = []
    const pictures = [{id: 1, label: 'Unicorn'}, {id: 2, label: 'Mermaid'}, {id: 3, label: 'Dragon'}, {id: 4, label: 'Vampire'}, {id: 5, label: 'Robot'}, {id: 6, label: 'Skull'}]

    let color = ''
    let username = ''

    // Get Profile Information
    async function getInfo() {
        try {
            const response = await fetch(`${$BASE_URL}/api/profile/${$user.id}`, {
                credentials: 'include'
            })
            if(response.ok) {
                const data = await response.json()
                const user = data.data
                color = user.color
                username = user.user_name
                pictureSelect = [pictures[user.picture_number-1]]
                return user
            }
            const data = await response.json()
            Toastr.warning(data.message)
        } catch {
            Toastr.error('Failed to receive profile. Try again later.')
        }
    }

    // Update Profile
    let updateMode = false

    async function patchUser(body, success, unsuccess) {
        try {
            const response = await fetch(`${$BASE_URL}/api/users/${$user.id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            if(!response.ok) {
                Toastr.warning(unsuccess)
                return
            }
            Toastr.success(success)
        } catch {
            Toastr.error('Unable to update user. Try again later.')
        }
    }

    function saveColor() {
        const body = { color: color }

        patchUser(body, 'Banner color updated.', 'Banner color update was unsuccessfull.')
    }

    async function updateUserName() {
        const body = { user_name: username }

        patchUser(body, 'Username sucessfully updated.', 'Unsucessfull attempt at updating username.')
    }

    async function updatePicture() {
        const body = { picture_number: pictureSelect[0].id }
        try {
            const response = await fetch(`${$BASE_URL}/api/users/${$user.id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            if(!response.ok) {
                Toastr.warning('Unsucessfull attempt at updating profile picture.')
                return
            }
            Toastr.success('Profile picture sucessfully updated.')
        } catch {
            Toastr.error('Unable to update user. Try again later.')
        }
    }

    function enterEditMode() {
        updateMode = true
    }

    function exitEditMode() {
        updateMode = false
    }

    async function deleteOwnProfile() {
        try {
            const response = await fetch(`${$BASE_URL}/api/users/${$user.id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            })

            if (!response.ok) {
                const json = await response.json()
                Toastr.warning(json.message)
                return
            }
            
            navigate('/')
            user.set(null)
        } catch {
            Toastr.error('Unable to delete book. Try again later.')
	    }
    }
</script>

{#await getInfo()}
    <p>Loading...</p>
{:then user}
    <div id="profilebanner" style="background-color: {color};color:white">
        <img id="profilePicture" src="/profilPictures/{pictureSelect[0].id}.png" alt="Profile." height="200">

        <PageHeader header={username}></PageHeader>
    </div>

    {#if updateMode === true}
        <PageHeader header={'Edit Profile'}></PageHeader>
        <MultiSelect on:change={() => updatePicture()} bind:selected={pictureSelect} options={pictures} loading={pictures.length===0} maxSelect={1}/>
        <input type="color" bind:value={color} style="height: 50px;" on:change|preventDefault={saveColor} id="colorInp">
        <input type="text" bind:value={username} on:change|preventDefault={updateUserName}>

        <Confirm
            confirmTitle="Delete"
            themeColor="110"
            let:confirm="{confirmThis}"
        >
            <Button class="danger" on:click={() => confirmThis(deleteOwnProfile)}>Delete User</Button>
        </Confirm>

        <Button on:click={() => exitEditMode()}>Exit Edit</Button>
    {:else}
        <Button on:click={() => enterEditMode()}>Edit Profile</Button>
    {/if}

    <h3>Want to read</h3>
    <div id="toReadList">
        {#each user?.want_to_read as book}
            <h5><Book book={book}></Book></h5>
        {/each}
    </div>

    <h3>Read</h3>
    <div id="readList">
        {#each user?.read as book}
            <h5><Book book={book}></Book></h5>
        {/each}
    </div>

    <h3>Own Reviews</h3>
    <div id="reviewList">
        {#each user.reviews as review}
            <h5><UsersReview review={review}></UsersReview></h5>
        {/each}
    </div>
{/await}

<style>
    #toReadList, #readList, #reviewList {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }

    h5 {
        width: 20%;
    }

    h3 {
        margin-top: 20px;
        margin-bottom: 50px;
    }
</style>