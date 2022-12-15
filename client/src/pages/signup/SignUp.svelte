<script>
    import { onMount } from "svelte";
    import { Router, Link } from "svelte-navigator"
    import { BASE_URL } from "../../store/globals.js"
    import * as Toastr from "toastr"
    import '../../../node_modules/toastr/build/toastr.css'

    onMount(() => {
        const nameInp = document.getElementById("signNameInp")
        const emailInp = document.getElementById("signEmailInp")
        const passwordInp = document.getElementById("signPassInp")
        const passwordInpTwo = document.getElementById("signPassInpTwo")
        const signForm = document.getElementById("signForm")

        signForm.addEventListener("submit", (event) => {
            event.preventDefault()

            if (passwordInp.value !== passwordInpTwo.value) {
                return Toastr.warning("The two passwords are not the same.")
            }
            
            if (passwordInp.value.length <9) {
                return Toastr.warning("The length of the password needs to be longer than 8.")
            }
            
            const body = {
                username: nameInp.value
                email: emailInp.value,
                password: passwordInp.value,
            }

            return fetch(`${$BASE_URL}/signUp`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            }).then((response) => {
                response.json().then((x) => Toastr.success(x.message))
            }).catch((response) => {
                Toastr.error("Not possible to sign up. Try again later.")
        })
    })
   })
</script>


<Router primary={false}>
    <div id="signBox">
        <form id="signForm" action="/singUp" method="POST">
            <h2>Sign up</h2>
                <input type="text" id="signNameInp" placeholder="May Flower">
                <input type="email" id="signEmailInp" placeholder="node@mail.dk">
                <input type="password" id="signPassInp" placeholder="Enter password">
                <input type="password" id="signPassInpTwo" placeholder="Reenter password">
                <input type="submit" id="signSubmit" value="Sign Up">
        </form>
    </div>
    <Link to="/login">Return to Login</Link>
</Router>