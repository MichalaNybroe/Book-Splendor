<script>
    import { Router, Link, useNavigate } from 'svelte-navigator'
    import { user } from '../../store/auth.js'
    import * as Toastr from 'toastr'
    import '../../../node_modules/toastr/build/toastr.css'
    import { BASE_URL } from '../../store/globals.js'
    import Button from '../../components/Button.svelte'
    import MultiSelect from 'svelte-multiselect'
    import { Confirm } from 'svelte-confirm'
    
    const navigate = useNavigate()
    
    if ($user === null || $user.admin === true) {
        navigate('/')
    }


    // Update Profile
    let updateMode = false

    let pictureSelect = Object.values($user.picture_number)
    const pictures = [{id: 1, label: 'Unicorn'}, {id: 2, label: 'Mermaid'}, {id: 3, label: 'Dragon'}, {id: 4, label: 'Vampire'}, {id: 5, label: 'Robot'}, {id: 6, label: 'Skull'}]


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
        const body = { color: $user.color }

        patchUser(body, 'Banner color updated.', 'Banner color update was unsuccessfull.')
    }

    async function updateUserName() {
        const body = { user_name: $user.user_name }

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
            $user.picture_number = pictureSelect[0].id
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

<div id="profilebanner" style="background-color: {$user.color};color:white">
    <img id="profilePicture" src="/profilPictures/{$user.picture_number}.png" alt="Profile." height="200">

    <h3 id="username">{$user?.user_name}</h3>
</div>

{#if updateMode === true} 
    <MultiSelect on:change={() => updatePicture()} bind:selected={pictureSelect} options={pictures} loading={pictures.length===0} maxSelect={1}/>
    <input type="color" bind:value={$user.color} style="height: 50px;" on:change|preventDefault={saveColor} id="colorInp">
    <input type="text" bind:value={$user.user_name} on:change|preventDefault={updateUserName}>

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

<div id="toReadList">

</div>

<div id="readList">

</div>

<div id="reviewList">

</div>


<Router primary={false}>
    <Link to="/invite">Invite a friend?</Link>
</Router>