<script>
    import { useNavigate } from 'svelte-navigator'
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

    let password
    let passwordTwo

    async function updatePassword() {
        if (password !== passwordTwo) {
            return Toastr.warning('The two passwords are not the same.')
        }
        
        if (password.length <8) {
            return Toastr.warning('The length of the password needs to be longer than 8.')
        }

        const body = {
            email: $user.email,
            password: password,
            passwordTwo: passwordTwo
        }

        try {
            const response = await fetch(`${$BASE_URL}/updatePassword`, {
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

        const json = await response.json()
        Toastr.success(json.message)
        } catch {
            Toastr.error('Unable to update password. Try again later.')
        }
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

        <h1 class="center">{username}</h1>
    </div>

    {#if updateMode === true}
        <PageHeader header={'Edit Profile'}></PageHeader>
        <h4>Change icon</h4>
        <MultiSelect on:change={() => updatePicture()} bind:selected={pictureSelect} options={pictures} loading={pictures.length===0} maxSelect={1}/>
        <br>
        <h4>Change banner color</h4>
        <input type="color" bind:value={color} style="height: 50px;" on:change|preventDefault={saveColor} id="colorInp">
        <br>
        <br>
        <h4>Change username</h4>
        <input type="text" bind:value={username} on:change|preventDefault={updateUserName}>
        <br>  
        <br>  

        <div>
            <Confirm
                confirmTitle="Update"
                themeColor="110"
                let:confirm="{confirmThis}"
            >
                <form on:submit|preventDefault={() => confirmThis(updatePassword)}>
                    <h4>Change password</h4>
                    <input type="text" placeholder="New password" bind:value={password} required>
                    <br>
                    <br>
                    <input type="text" placeholder="Repeat new password" bind:value={passwordTwo} required>
                    <br>
                    <br>
                    <Button class="create" type="submit">Update</Button>
                    
                </form>
            </Confirm>
        </div>

        <Button class="create" on:click={() => exitEditMode()}>Exit Edit</Button>

        <div class="right">
            <Confirm
                confirmTitle="Delete"
                themeColor="110"
                let:confirm="{confirmThis}"
            >
                <Button class="deleteUser" on:click={() => confirmThis(deleteOwnProfile)}>Delete User</Button>
            </Confirm>
        </div>
        
    {:else}
        <div id="editProfile">
            <Button class="create" on:click={() => enterEditMode()}>Edit Profile</Button>
        </div>
    {/if}

    <h3>Want to read</h3>
    <div id="toReadList">
        {#each user?.want_to_read.slice(0,5) as book}
            <h5><Book book={book}></Book></h5>
        {/each}
    </div>

    <h3>Read</h3>
    <div id="readList">
        {#each user?.read.slice(0,5) as book}
            <h5><Book book={book}></Book></h5>
        {/each}
    </div>

    <h3>Own Reviews</h3>
    <div id="reviewList">
        {#each user.reviews.slice(0,5) as review}         
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

    h4 {
        margin-bottom: 4px;
    }

    h3 {
        margin-top: 20px;
        margin-bottom: 50px;
    }

    h1 {
        font-size: 60px;
    }

    .right {
        float: right;
    }

    .center {
        text-align: center;
        margin-left: 25%;
    }

    #profilebanner {
        display: flex;
        align-items: center;
    }

    img {
        border-radius: 50%;
        border: 5px solid rgba(0,0,0,0.2);
    }

    #editProfile {
        float: right;
        border-bottom: 1px solid #EEE;
        margin-top: 0px;
    }
</style>