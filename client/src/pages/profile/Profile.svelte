<script>
    import { Router, Link, useNavigate } from 'svelte-navigator'
    import { user } from '../../store/auth.js'
    import * as Toastr from 'toastr'
    import '../../../node_modules/toastr/build/toastr.css'
    import ColorChangesWidget from '../../components/ColorChangesWidget/ColorChangesWidget.svelte'
    import { BASE_URL } from '../../store/globals.js'
    
    
    if ($user === null || $user.admin === true) {
        const navigate = useNavigate()

        navigate('/')
    }

    async function saveColor() {
        const body = { color: $user.color }

        try {
            const response = await fetch(`${$BASE_URL}/api/users/${$user.id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            if(!response.ok) {
                Toastr.warning('Banner color update was unsuccessfull.')
                return
            }
            Toastr.success('Banner color updated.')
        } catch {
            Toastr.error('Unable to update banner color. Try again later.')
        }
    }
</script>

<div id="profilebanner" style="background-color: {$user.color};color:white">
    <img id="profilePicture">

    <h3 id="username">{$user?.user_name}</h3>
    <input type="color" bind:value={$user.color} style="height: 50px;" on:change|preventDefault={saveColor} id="colorInp">
</div>

<div id="toReadList">

</div>

<div id="readList">

</div>


<p>mark as</p>
<p>read</p>
<p>want to read</p>
<p>reviews</p>

<!--<input bind:value={colorValue} type="color">
<button on:click={sendColor}>Choose color</button>-->


<ColorChangesWidget />

<Router primary={false}>
    <Link to="/invite">Invite a friend?</Link>
</Router>