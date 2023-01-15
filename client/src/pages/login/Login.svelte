<script>
    import { Router, Link, useNavigate } from 'svelte-navigator'
    import { BASE_URL } from '../../store/globals.js'
    import { user } from '../../store/auth.js'
    import * as Toastr from 'toastr'
    import '../../../node_modules/toastr/build/toastr.css'
    import Button from '../../components/Button.svelte'

    const navigate = useNavigate()

    if($user) {
        navigate('/')
        Toastr.info('You are already signed in.')
    }

    let emailInp = ''
    let passwordInp = ''

    async function login() {
        const body = {
            email: emailInp,
            password: passwordInp,
        }

        try {
            const response = await fetch(`${$BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(body)
            })

            if (!response.ok) {
                const json = await response.json()
                Toastr.warning(json.message)
                return
            }
            const data = await response.json()
            user.set(data.data)
            localStorage.setItem("user", JSON.stringify($user))

            if($user.admin === true) {
                navigate('/admin/books')
            } else {
                navigate('/profile')
            }
        } catch {
            Toastr.error('Unable to login. Try again later.')
        }
    }
</script>


<div id="outer">
    <div id="container">

        <Router primary={false}>
            <div id="loginBox">
                <form action="/login" method="POST" id="loginForm" on:submit|preventDefault={login}>
                    <h2>Sign In!</h2>
                    <br>
                    <label for="email">Email:</label>
                    <br>
                    <input
                        type="email"
                        name="email"
                        placeholder="your@mail.dk"
                        id="email"
                        bind:value={emailInp}/>
                    <br>
                    <br>
                    <label for="password">Password:</label>
                    <br>
                    <input
                        type="password"
                        name="password"
                        placeholder="*********"
                        id="password"
                        bind:value={passwordInp}
                    />
                    <br>
                    <br>
                    <Button class="login">Login </Button>
                    <Link to="/forgotPassword"><p  id="forgotPW">Forgot your password?</p></Link>
                    <br>
                    <Link to="/signUp"><p id="signUp">Sign Up</p></Link>
                </form>
            </div>
            <br>
        </Router>

    </div>
</div>


<style>
    form {
        text-align: center;
        padding: 40px;
    }

    h2 {
        color: #474544;
        font-size: 32px;
        font-weight: 700;
        letter-spacing: 7px;
        text-align: center;
        text-transform: uppercase;
        margin-top: 10px;
    }
    
  /*   h1 {
        color: #474544;
        font-size: 32px;
        font-weight: 700;
        letter-spacing: 7px;
        text-align: center;
        text-transform: uppercase;
        margin-top: 10px;
    } */

    #container {
        border: solid 3px #474544;
        max-width: 768px;
        margin: 60px auto;
        margin-bottom: 480px;
        position: relative;
  }

    #outer {
        height: 60vh;
    }

    input {
        color: #5a5a5a;
        font: inherit;
        margin: 0;
    }

    #loginBox label {
        font-size: 20px;
    }

</style>