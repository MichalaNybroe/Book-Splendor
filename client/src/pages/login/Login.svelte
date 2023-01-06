<script>
    import { Router, Link, useNavigate } from 'svelte-navigator'
    import { BASE_URL } from '../../store/globals.js'
    import { user } from '../../store/auth.js'
    import * as Toastr from 'toastr'
    import '../../../node_modules/toastr/build/toastr.css'
    import Button from '../../components/Button.svelte'

    const navigate = useNavigate()

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

<div id="container">

<Router primary={false}>
    <div id="loginBox">
        <form action="/login" method="POST" id="loginForm" on:submit|preventDefault={login}>
            <h1>Sign In!</h1>
            <br />
            <label for="email">Email:</label>
            <br>
            <input
                type="email"
                name="email"
                placeholder="your@mail.dk"
                id="email"
                bind:value={emailInp}/>
            <br />
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
            <br />
            <br>
            <Button class="login" on:click={()=> login()}>Login </Button>
            <Link to="/forgotPassword"><p  id="forgotPW">Forgot your password?</p></Link>
            <Link to="/signUp"><p id="signUp">Sign Up</p></Link>
        </form>
    </div>
</Router>

</div>

<!-- <td><Button class="danger" on:click={()=> deleteBook(book)}>
                <i class="w3-margin-left fa fa-trash"></i>
            </Button></td>
        -->

<style>
      :global(body) {
        font-family: Georgia, 'Times New Roman', Times, serif;
    }

    form {
        text-align: center;
    }

    h1 {
        color: #474544;
        font-size: 32px;
        font-weight: 700;
        letter-spacing: 7px;
        text-align: center;
        text-transform: uppercase;
  }

    #container {
        border: solid 3px #474544;
        max-width: 768px;
        margin: 60px auto;
        position: relative;
  }

</style>