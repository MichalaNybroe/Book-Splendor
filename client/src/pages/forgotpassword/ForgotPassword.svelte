<script>
    import { onMount } from 'svelte'
    import { Router, Link } from 'svelte-navigator'
    import { BASE_URL } from '../../store/globals.js'
    import * as Toastr from 'toastr'
    import '../../../node_modules/toastr/build/toastr.css'


    let emailInp = ''

    async function forgotPassword() {
        try {
            const response = fetch(`${$BASE_URL}/forgotPassword`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailInp.value }),
            })

            if(!response.ok) {
                const json = await response.json()
                Toastr.warning(json.message)
                return
            }

            const json = await response.json()
            Toastr.success(json.message)
        } catch {
            Toastr.error('Unable to handle request. Please try again later.')
        }
    }
</script>

<Router primary={false}>
    <div id="forgotBox">
        <form id="forgotForm" on:submit|preventDefault={forgotPassword}>
            <h3>
                Enter email and we will send you a mail with your new password.
            </h3>
            <p>Remember to change your password after.</p>
            <input
                bind:value={emailInp}
                type="email"
                id="forgotEmailInp"
                placeholder="shelter@mail.dk"
            />
            <input type="submit" id="forgotSubmit" value="Reset" />
        </form>
    </div>
    <Link to="/login" class="link">Return to Login</Link>
</Router>