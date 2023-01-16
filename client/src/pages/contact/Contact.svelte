<script>
  import { BASE_URL } from '../../store/globals.js'
  import * as Toastr from 'toastr'
  import '../../../node_modules/toastr/build/toastr.css'

  let name = ''
  let email = ''
  let subject = ''
  let message = ''

  async function handleSubmit() {
    const regex = new RegExp("[a-z0-9]+@[a-z]+\.[a-z]{2,3}")
        if (!regex.test(email)) {
            return Toastr.warning('Please enter a valid email.')
        }

    const body = {
      name: name,
      email: email,
      subject: subject,
      message: message,
    }

    try {
      const response = await fetch(`${$BASE_URL}/contact`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      if (!response.ok) {
        const json = await response.json()
        Toastr.warning(json.message)
        return
      }
      const json = await response.json()
      Toastr.success('We have received your message.')
    } catch {
      Toastr.error('Unable to deliver message. Try again later.')
    }
  }
  
</script>

<div id="container">
  <h1>&bull; Send Us a Letter &bull;</h1>
  <form
    on:submit|preventDefault={handleSubmit}
    id="contact_form"
    method="POST"
    action="/contact"
  >
    <div class="name">
      <label for="name" />
      <input type="text" placeholder="Name" name="name" id="name" required bind:value={name}/>
    </div>
    <div class="email">
      <label for="email" />
      <input
        type="email"
        placeholder="E-mail"
        name="email"
        id="email"
        required
        bind:value={email}
      />
    </div>
    <div class="subject">
      <label for="subject" />
      <select placeholder="Subject" name="subject" id="subject" required bind:value={subject}>
        <option>I'd like to ask a question</option>
        <option>I'd like to start a book club</option>
      </select>
    </div>
    <div class="message">
      <label for="message" />
      <textarea
        name="message"
        placeholder="Message"
        id="message"
        cols="30"
        rows="5"
        required
        bind:value={message}
      />
    </div>
    <div class="submit">
      <input type="submit" value="Send Message" id="submit_button" />
    </div>
  </form>
</div>

<style>
  @import url(https://fonts.googleapis.com/css?family=Montserrat:400,700);

  input,
  select,
  textarea {
    color: #5a5a5a;
    font: inherit;
    margin: 0;
  }

  input {
    line-height: normal;
  }

  textarea {
    overflow: auto;
  }

  #container {
    border: solid 3px #474544;
    max-width: 768px;
    margin: 60px auto 150px;
    position: relative;
  }

  form {
    padding: 37.5px;
    margin: 50px 0;
  }

  h1 {
    color: #474544;
    font-size: 32px;
    font-weight: 700;
    letter-spacing: 7px;
    text-align: center;
    text-transform: uppercase;
    margin-top: 30px;
  }

  .email {
    float: right;
    width: 45%;
  }

  input[type="text"],
  [type="email"],
  select,
  textarea {
    background: none;
    border: none;
    border-bottom: solid 2px #474544;
    color: #474544;
    font-size: 1em;
    font-weight: 400;
    letter-spacing: 1px;
    margin: 0em 0 1.875em 0;
    padding: 0 0 0.875em 0;
    text-transform: uppercase;
    width: 100%;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    -ms-box-sizing: border-box;
    -o-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-transition: all 0.3s;
    -moz-transition: all 0.3s;
    -ms-transition: all 0.3s;
    -o-transition: all 0.3s;
    transition: all 0.3s;
  }

  input[type="text"]:focus,
  [type="email"]:focus,
  textarea:focus {
    outline: none;
    padding: 0 0 0.875em 0;
  }

  .message {
    float: none;
  }

  .name {
    float: left;
    width: 45%;
  }

  .subject {
    width: 100%;
  }

  textarea {
    line-height: 150%;
    height: 150px;
    resize: none;
    width: 100%;
  }

  #submit_button {
    background: none;
    border: solid 2px #474544;
    color: #474544;
    cursor: pointer;
    display: inline-block;
    font-family: "Helvetica", Arial, sans-serif;
    font-size: 0.875em;
    font-weight: bold;
    outline: none;
    padding: 20px 35px;
    text-transform: uppercase;
  }

  #submit_button:hover {
    background: #474544;
    color: #f2f3eb;
  }

  /*
Styling by David Fitas on https://codepen.io/dfitzy/pen/VepqMq */
</style>
