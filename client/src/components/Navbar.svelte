<script>
    import { Router, Link, useNavigate } from 'svelte-navigator'
    import { user } from '../store/auth.js'
    import { BASE_URL } from '../store/globals.js'
    import * as Toastr from 'toastr'
    import '../../node_modules/toastr/build/toastr.css'
    import Button from '../components/Button.svelte'

    const navigate = useNavigate()

    async function logout()  {

        try {
            const response = await fetch(`${$BASE_URL}/logout`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if(response.ok){
                navigate('/')
                user.set(null)
            } else {
                const json = await response.json()
                Toastr.warning(json.message)
            }
        } catch {
            Toastr.error('Unable to logout. Please try again later.')
        }
    }
</script>

<Router primary={false}>
    <nav>
        <h1 class="margin-left">
        <Link to="/"><img src="/favicon.png" alt="Book-Splendor icon" height="50px"></Link>
        {#if $user === null}
            <Link to="/">Home</Link>
            <Link to="/books">Books</Link>
            <Link to="/contact">Contact</Link>
        {:else if $user.admin === false}
            <Link to="/">Home</Link>
            <Link to="/books">Books</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/profile">Profile</Link>
        {:else if $user.admin === true}
            <Link to="/admin/books">Books</Link>
            <Link to="/admin/users">Users</Link>
            <Link to="/admin/reviews">Reviews</Link>
        {/if}

        {#if $user !== null}
            <Button class="logout" on:click={logout}>Logout</Button>
        {:else}
            <Button class="logout" on:click="{() => navigate("/login")}">Login</Button>
         {/if}
      </nav>
</Router>


<style>
    .margin-left {
        margin-left: 29px
    }
</style>
