<script>
    import { Router, Link } from 'svelte-navigator'
    import { BASE_URL } from '../../store/globals.js'
    import * as Toastr from 'toastr'
    import '../../../node_modules/toastr/build/toastr.css'

    let nameInp = ''
    let emailInp = ''
    let passwordInp = ''
    let passwordInpTwo = ''

    async function signUp() {
        if (passwordInp !== passwordInpTwo) {
            return Toastr.warning('The two passwords are not the same.')
        }
        
        if (passwordInp.length <8) {
            return Toastr.warning('The length of the password needs to be longer than 8.')
        }

        const body = {
            username: nameInp,
            email: emailInp,
            password: passwordInp,
            passwordTwo: passwordInpTwo
        }
        
        try {
            const response = await fetch(`${$BASE_URL}/signUp`, {
                method: 'POST',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
        })

        if (!response.ok) {
            const json = await response.json()
            Toastr.warning(json.message)
            return
        }

        const json = await response.json()
        Toastr.success(json.message)
        } catch {
            Toastr.error('Unable to sign up. Try again later.')
        }
    }
</script>


<Router primary={false}>
    <div id="signBox">
        <form id="signForm" action="/singUp" method="POST" on:submit|preventDefault={signUp}>
            <h3>Sign up</h3>
                <label for="name">Username:</label>
                <input bind:value={nameInp} type="text" id="signNameInp" placeholder="May Flower" name="name" required>
                <label for="email">Email:</label>
                <input bind:value={emailInp} type="email" id="signEmailInp" placeholder="flower@mail.dk" name="email" required>
                <label for="passOne">Password:</label>
                <input bind:value={passwordInp} type="password" id="signPassInp" placeholder="*********" name="passOne" required>
                <label for="passsTwo">Reenter password:</label>
                <input bind:value={passwordInpTwo} type="password" id="signPassInpTwo" placeholder="*********" name="passTwo" required>
                <input type="submit" id="signSubmit" value="Sign Up">
        </form>
    </div>
    <Link to="/login">Return to Login</Link>
</Router>