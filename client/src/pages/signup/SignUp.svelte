<script>
    import { Router, Link, useNavigate } from 'svelte-navigator'
    import { user } from '../../store/auth.js'
    import { BASE_URL } from '../../store/globals.js'
    import * as Toastr from 'toastr'
    import '../../../node_modules/toastr/build/toastr.css'
    import GDPR from '../../components/GDPR.svelte'
    import Modal from 'svelte-simple-modal'
    import { writable } from 'svelte/store'

    const navigate = useNavigate()

    if ($user) {
        navigate('/')
        Toastr.info('You are already signed in.')
    }

    const modal = writable(null)
    const showModal = () => modal.set(GDPR)
    let acceptData = false

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

        const mail = emailInp
        const regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}')
        if (!regex.test(mail)) {
            return Toastr.warning('Please enter a valid email.')
        }

        const body = {
            username: nameInp,
            email: emailInp,
            password: passwordInp,
            passwordTwo: passwordInpTwo,
            acceptData: acceptData
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

<div id="outer">
    <div id="container">
        <Router primary={false}>
            <div id="signBox">
                <form id="signForm" action="/singUp" method="POST" on:submit|preventDefault={signUp}>
                    <h2>Sign up!</h2>
                    <br>
                    <label for="name">Username:</label>
                    <br>
                    <input bind:value={nameInp} type="text" id="signNameInp" placeholder="May Flower" name="name" required>
                    <br>
                    <br>
                    <label for="email">Email:</label>
                    <br>
                    <input bind:value={emailInp} type="email" id="signEmailInp" placeholder="flower@mail.dk" name="email" required>
                    <br>
                    <br>
                    <label for="passOne">Password:</label>
                    <br>
                    <input bind:value={passwordInp} type="password" id="signPassInp" placeholder="*********" name="passOne" required>
                    <br>
                    <br>
                    <label for="passsTwo">Reenter password:</label>
                    <br>
                    <input bind:value={passwordInpTwo} type="password" id="signPassInpTwo" placeholder="*********" name="passTwo" required>
                    <br>
                    <br>
                    <label>
                        <input type=checkbox style="width: 20px" bind:checked={acceptData}>
                        Agree to continue
                    </label>
                    <br>
                    <Modal show={$modal}>
                        <button class="create" on:click={showModal}>Read our data compliance</button>
                    </Modal>
                    <br>
                    <br>
                    <button disabled={!acceptData} type="submit" id="signSubmit" value="Sign Up">Sign up</button>
                    <br>
                    <br>
                    <Link to="/login">Return to Login</Link>
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

    h2 {
        color: #474544;
        font-size: 32px;
        font-weight: 700;
        letter-spacing: 7px;
        text-align: center;
        text-transform: uppercase;
        margin-top: 10px;
    }

/*     h1 {
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
        position: relative;
        margin-top: -50px;
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

    #signBox label {
        font-size: 20px;
    }

</style>