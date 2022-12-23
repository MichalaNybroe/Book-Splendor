<script>
    import { Router, Link, useNavigate } from "svelte-navigator"
    import { BASE_URL } from "../../store/globals.js"
    import { user } from "../../store/auth.js"
    import * as Toastr from "toastr"
    import '../../../node_modules/toastr/build/toastr.css'

    const navigate = useNavigate()

    let emailInp = ""
    let passwordInp = ""

    async function login() {
        const body = {
            email: emailInp,
            password: passwordInp,
        }

        try {
            const response = await fetch(`${$BASE_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(body)
            })

            if (!response.ok) {
                const json = await response.json()
                Toastr.warning(json.message)
            return
            }
            const data = await response.json()
            user.set(data.data)
            if($user.admin === true) {
                navigate("/admin/books")
            } else {
                navigate("/profile")
            }

        } catch {
            Toastr.error("Unable to login. Try again later.")
        }
    }
</script>


<Router primary={false}>
    <div id="loginBox">
        <form action="/login" method="POST" id="loginForm" on:submit|preventDefault={login}>
            <h4>Sign In!</h4>
            <br />
            <label for="email">Email:</label>
            <input
                type="email"
                name="email"
                placeholder="great@mail.dk"
                id="email"
                bind:value={emailInp}/>
            <br />
            <label for="password">Password:</label>
            <input
                type="password"
                name="password"
                placeholder="*********"
                id="password"
                bind:value={passwordInp}
            />
            <br />
            <input type="submit" id="logButton" value="Login" />
            <Link to="/forgotPassword"><p  id="forgotPW">Forgot your password?</p></Link>
            <Link to="/signUp"><p id="signUp">Sign Up</p></Link>
        </form>
    </div>
</Router>