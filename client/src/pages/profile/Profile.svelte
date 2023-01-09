<script>
    import { Router, Link, useNavigate } from 'svelte-navigator'
    import { user } from '../../store/auth.js'
    import * as Toastr from 'toastr'
    import '../../../node_modules/toastr/build/toastr.css'
    import { BASE_URL } from '../../store/globals.js'
    import Button from '../../components/Button.svelte'
    import MultiSelect from 'svelte-multiselect'
    
    
    if ($user === null || $user.admin === true) {
        const navigate = useNavigate()

        navigate('/')
    }

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
        const body = { color: $user.color }

        patchUser(body, 'Banner color updated.', 'Banner color update was unsuccessfull.')
    }

    async function updateUserName(event) {
        event.preventDefault()
        const body = { user_name: $user.user_name }

        patchUser(body, 'Username sucessfully updated.', 'Unsucessfull attempt at updating username.')
    }

    async function updatePicture() {
        console.log('Vi er i updatePicture funktionen')
        const body = { user_picture: $user.picture_number}

        patchUser(body, 'Profile picture sucessfully updated.', 'Unsucessfull attempt at updating profile picture.')
    }

    function enterEditMode() {
        updateMode = true
    }

    function exitEditMode() {
        updateMode = false
    }

    let pictureSelect = []
    const pictures = [{label: 'Unicorn', id: 1}, {label: 'Mermaid', id: 2}, {label: 'Dragon', id: 3}, {label: 'Vampire', id: 4}, {label: 'Robot', id: 5}, {label: 'Skull', id: 6}]


</script>

<div id="profilebanner" style="background-color: {$user.color};color:white">
    <img id="profilePicture" src="/profilPictures/{$user.picture_number}.png" alt="Profile.">

    <h3 id="username">{$user?.user_name}</h3>
</div>

{#if updateMode === true} 
    <MultiSelect on:change={()=> updatePicture()} bind:selected={pictureSelect} options={pictures} loading={pictures.length===0} maxSelect={1}/>
    <input type="color" bind:value={$user.color} style="height: 50px;" on:change|preventDefault={saveColor} id="colorInp">
    <input type="text" bind:value={$user.user_name} on:change|preventDefault={updateUserName}>
    <Button on:click={()=> exitEditMode()}>Exit Edit</Button>
{:else}
    <Button on:click={()=> enterEditMode()}>Edit Profile</Button>
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