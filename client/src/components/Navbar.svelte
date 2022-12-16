<script>
    import { Router, Link, useNavigate } from "svelte-navigator"
    import { user } from "../store/auth.js"
    import { BASE_URL } from "../store/globals.js"

    const navigate = useNavigate()

    async function logout()  {
        user.set(null)

        await fetch(`${$BASE_URL}/logout`, {
            method: "POST",
        })

        navigate("/")
    }

</script>

<Router primary={false}>
    <nav>
        <h1 class="margin-left">
        <Link to="/"><img src="/favicon.png" alt="Book-Splendor icon" height="50px"></Link> 
        {#if $user = true} <!--  {#if $user.admin = true}-->
            <Link to="/admin/books">Books</Link>
            <Link to="/admin/users">Users</Link>
            <Link to="/admin/reviews">Reviews</Link>
        {:else}
            <Link to="/">Home</Link>
            <Link to="/books">Books</Link>
            <Link to="/contact">Contact</Link>
        {/if}
        {#if $user != null}
            <button on:click={logout}>Logout</button>
        {:else}
            <Link to="/login">Login</Link>
        {/if}
      </nav>
</Router>

<style>
.margin-left {
    margin-left: 5px
}

a {
    color: #588157;
}

button {
    color: #588157;
}

</style>
