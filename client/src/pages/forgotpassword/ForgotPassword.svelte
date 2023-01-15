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
                credentials: 'include',
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

<div id="outer">
    <div id="container">

        <Router primary={false}>
            <div id="forgotBox">
                <form id="forgotForm" on:submit|preventDefault={forgotPassword}>
                    <h1>Forgot Password?</h1>
                    <br>
                    <h3>Enter email and we will send you a mail with your new password.</h3>
                    <br>
                    <p>Remember to change your password after.</p>
                    <br>
                    <input
                        bind:value={emailInp}
                        type="email"
                        id="forgotEmailInp"
                        placeholder="yourmailhere@mail.dk"
                    />
                    <br>
                    <br>
                    <input class="create" type="submit" id="forgotSubmit" value="Reset" />
                    <br>
                    <br>
                    <Link to="/login" class="link">Return to Login</Link>
                    <br>
                    <br>
                </form>
            </div>
   
        </Router>
    </div>
</div>


<style>
    form {
        text-align: center;
        padding: 40px;
    }

    h1 {
        color: #474544;
        font-size: 32px;
        font-weight: 700;
        letter-spacing: 7px;
        text-align: center;
        text-transform: uppercase;
        margin-top: 10px;
  }

    #container {
        border: solid 3px #474544;
        max-width: 768px;
        margin: 60px auto;
        position: relative;
  }

    .create {
        background: none;
        border: solid 1px #474544;
        color: #474544;
        cursor: pointer;
        display: inline-block;
        font-family: "Helvetica", Arial, sans-serif;
        font-size: 0.875em;
        font-weight: bold;
        outline: none;
        padding: 5px 15px;
        width: 210px; 
    }

    .create:hover {
        background: #474544;
        color: #f2f3eb;
    }

    #outer {
        height: 60vh;
    }

    input {
        width: 203px;
    }
</style>