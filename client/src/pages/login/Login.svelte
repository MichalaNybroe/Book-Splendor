<script>
    import { onMount } from "svelte"
    import { Router, Link, useNavigate } from "svelte-navigator"
    import { BASE_URL } from "../../store/globals.js"
    import { user, user_email, user_name, user_admin, user_picture, user_color } from "../../store/auth.js"
    import * as Toastr from "toastr"
    import '../../../node_modules/toastr/build/toastr.css'

    const navigate = useNavigate()

    onMount(async () => {
        const emailInp = document.getElementById("email")
        const passwordInp = document.getElementById("password")
        const loginForm = document.getElementById("loginForm")

        loginForm.addEventListener("submit", (event) => {
            event.preventDefault()

            const body = {
                email: emailInp.value,
                password: passwordInp.value,
            }

            return fetch(`${$BASE_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            }).then((response) => {
                    if (response.ok) {
                        response.json().then((data) => {
                            user.set(true)
                            user_email.set(data.data.email)
                            user_name.set(data.data.user_name)
                            console.log(data.data.admin)
                            if(data.data.admin === true) {
                                console.log("vi er i if")
                                user_admin.set(true)
                            } else {
                                user_admin.set(null)
                            }
                            user_picture.set(data.data.picture_number)
                            user_color.set(data.data.color)
                            
                            let admin = null
                            user_admin.subscribe((data) => {
                                admin = data
                            }) 
                            if(user_admin !== null) {
                                navigate("/admin/books")
                            }
                            if(user !== null && user_admin === null) {
                                navigate("/profile")
                            }
                        })
                    } else {
                        response.json().then((m) => Toastr.warning(m.message))
                    }
            }).catch(() => {

                Toastr.error("Not possible to login. Try again later.")
            })

        })
    })

</script>


<Router primary={false}>
    <div id="loginBox">
        <form action="/login" method="POST" id="loginForm">
            <h4>Sign In!</h4>
            <br />
            <label for="email">Email:</label>
            <input
                type="email"
                name="email"
                placeholder="great@mail.dk"
                id="email"
            /><br />
            <label for="password">Password:</label>
            <input
                type="password"
                name="password"
                placeholder="*********"
                id="password"
            />
            <br />
            <input type="submit" id="logButton" value="Login" />
            <Link to="/forgotPassword"><p  id="forgotPW">Forgot your password?</p></Link>
            <Link to="/signUp"><p id="signUp">Sign Up</p></Link>
        </form>
    </div>
</Router>