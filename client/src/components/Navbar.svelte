<script>
    import { Router, Link, useNavigate } from "svelte-navigator"
    import { user, user_admin, user_color, user_email, user_name, user_picture } from "../store/auth.js"
    import { BASE_URL } from "../store/globals.js"
    import * as Toastr from "toastr"
    import '../../node_modules/toastr/build/toastr.css'

    const navigate = useNavigate()

    async function logout()  {
       

        await fetch(`${$BASE_URL}/logout`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {
            if(response.ok){
                response.json().then((data) => {
                    user.set(null)
                    user_email.set(null)
                    user_name.set(null)
                    if(user_admin !== null) {
                        user_admin.set(null)
                    }
                    user_picture.set(null)
                    user_color.set(null)
                    navigate("/")
                })
            } else {
                response.json().then((data) => Toastr.warning(data.message))
            }
        }).catch(() => {
            Toastr.error("Unable to log out. Please try again later.")
        })
        console.log("vi er totalt logget ud")
        
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
        {:else if $user_admin === null && $user !== null}
            <Link to="/">Home</Link>
            <Link to="/books">Books</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/profile">Profile</Link>
        {:else if $user_admin !== null}
            <Link to="/admin/books">Books</Link>
            <Link to="/admin/users">Users</Link>
            <Link to="/admin/reviews">Reviews</Link>
        {/if}

        {#if $user !== null}
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

button {
    color: #588157;
}

</style>
