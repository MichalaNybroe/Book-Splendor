<script>
    import { onMount } from "svelte"
    import { Router, Link } from "svelte-navigator"
    import { BASE_URL } from "../../store/globals.js"
    import * as Toastr from "toastr"
    import '../../../node_modules/toastr/build/toastr.css'

    onMount(() => {
        const emailInp = document.getElementById("forgotEmailInp")
        const forgotForm = document.getElementById("forgotForm")

        forgotForm.addEventListener("submit", (event) => {
            event.preventDefault()

            return fetch(`${$BASE_URL}/forgotPassword`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: emailInp.value }),
            }).then((response) => {
                if (response.ok) {
                    Toastr.success("We have sent you an email")
                } else {
                    response.json().then((m) => Toastr.warning(m.message))
                }
            }).catch(
                () => {
                Toastr.error("Unsuccessfull. Try again later.")
            })
        })
    })
</script>

<Router primary={false}>
    <div id="forgotBox">
        <form id="forgotForm">
            <h3>
                Enter email and we will send you a mail with your new password.
            </h3>
            <p>Remember to change your password after.</p>
            <input
                type="email"
                id="forgotEmailInp"
                placeholder="shelter@mail.dk"
            />
            <input type="submit" id="forgotSubmit" value="Reset" />
        </form>
    </div>
    <Link to="/login" class="link">Return to Login</Link>
</Router>