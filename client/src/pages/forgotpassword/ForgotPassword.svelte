<script>
    import { Router, Link, useNavigate } from 'svelte-navigator'
    import { BASE_URL } from '../../store/globals.js'
    import { user } from '../../store/auth.js'
    import * as Toastr from 'toastr'
    import '../../../node_modules/toastr/build/toastr.css'

    const navigate = useNavigate()

    if($user) {
        navigate('/')
        Toastr.info('You are signed in.')
    }

    let emailInp = ''

    async function forgotPassword() {
        try {
            const response = await fetch(`${$BASE_URL}/forgotPassword`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailInp }),
            })

            const data = await response.json()

            if (!response.ok) {
                Toastr.warning(data.message)
                return
            }

            Toastr.success(data.message)
        } catch(error) {
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