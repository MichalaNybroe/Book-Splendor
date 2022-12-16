<script>
    import { BASE_URL } from "../../store/globals.js"
    import * as Toastr from "toastr"
    import '../../../node_modules/toastr/build/toastr.css'
    import { onMount } from "svelte";
    

    /*
  const handleSubmit = async data => {
    const formData = new FormData(data.currentTarget)

    const res = await fetch(`${$BASE_URL}/contact`, {
      method: 'POST',
      body: formData,
    })

    const { message } = await res.json()

    console.log(message)
  }
  */

  async function handleSubmit() {
		const mail = {
			// @ts-ignore
			name: document.getElementById("name").value,
			email: document.getElementById("email").value,
			subject: document.getElementById("subject").value,
			message: document.getElementById("message").value,
		};
		await fetch(`${$BASE_URL}/contact`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json;charset=utf-8",
			},
			body: JSON.stringify(mail),
		}).then((response) => {
                response.json().then((x) => Toastr.success("You've signed up! :)")) 
        })
    };
    

    //indsæt en alert eller notif (toastr?) når man har sendt en besked? eller videresend til anden side? 

</script>

<!--<h3>Any questions? Contact us here</h3>-->

<div id="container">
    <h1>&bull; Send Us a Letter &bull;</h1>
    <form on:submit|preventDefault="{handleSubmit}" id="contact_form"> <!--on:submit|preventDefault="{handleSubmit}"-->
      <div class="name">
        <label for="name"></label>
        <input type="text" placeholder="Name" name="name" id="name" required>
      </div>
      <div class="email">
        <label for="email"></label>
        <input type="email" placeholder="E-mail" name="email" id="email" required>
      </div>
      <div class="subject">
        <label for="subject"></label>
        <select placeholder="Subject" name="subject" id="subject" required>
          <option disabled hidden selected>I'd like to ask a question</option>
          <option>I'd like to ask a question</option>
          <option>I'd like to start a book club</option>
        </select>
      </div>
      <div class="message">
        <label for="message"></label>
        <textarea name="message" placeholder="Message" id="message" cols="30" rows="5" required></textarea>
      </div>
      <div class="submit">
        <input type="submit" value="Send Message" id="submit_button" /> 
        </div>
    </form>
  </div>


<style>
    
@import url(https://fonts.googleapis.com/css?family=Montserrat:400,700);


input, select, textarea {
  color: #5A5A5A;
  font: inherit;
  margin: 0;
}

input{
  line-height: normal;
}

textarea {
  overflow: auto;
}

#container {
  border: solid 3px #474544;
  max-width: 768px;
  margin: 60px auto;
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
}

.email {
	float: right;
	width: 45%;
}

input[type='text'], [type='email'], select, textarea {
	background: none;
  border: none;
	border-bottom: solid 2px #474544;
	color: #474544;
	font-size: 1.000em;
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

input[type='text']:focus, [type='email']:focus, textarea:focus {
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
  font-family: 'Helvetica', Arial, sans-serif;
  font-size: 0.875em;
  font-weight: bold;
  outline: none;
  padding: 20px 35px;
  text-transform: uppercase;
}

#submit_button:hover {
  background: #474544;
  color: #F2F3EB;
}

/*
Styling by David Fitas on https://codepen.io/dfitzy/pen/VepqMq */
</style>