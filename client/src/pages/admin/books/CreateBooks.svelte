<script>
    import { user } from "../../../store/auth.js"
    import { useNavigate } from "svelte-navigator"
    import { BASE_URL } from "../../../store/globals.js";
    import * as Toastr from "toastr";

    
    if($user.admin !== true) {
        const navigate = useNavigate()

        navigate("/")
    }

    let value = 'foo'
	let options = {}

    function loadOptions() {
        options = {
            '': 'Please choose...',
            
        }
    }

    async function handleSubmit() {
    const body = {
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      number: document.getElementById("number").value,
      series: document.getElementById("series").value,
      unreleased: document.getElementById("unreleased").value,
      image: document.getElementById("book_img").value,
      message: document.getElementById("authors").value,
      subject: document.getElementById("genres").value
    };

    await fetch(`${$BASE_URL}/api/books`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (response.ok) {
          Toastr.success("The book has been created.");
        } else {
          response.json().then((m) => Toastr.warning(m.message));
        }
      })
      .catch(() => {
        Toastr.error("Unsuccessfull. Try again later.");
      });
  }

</script>


<form on:submit|preventDefault={handleSubmit}
id="create_book_form"
method="POST"
action="/createbook">

<div class="title">
    <label for="title" />
    <input type="text" placeholder="Title" name="title" id="title">
</div>
<div class="description">
    <label for="description" />
    <input type="text" placeholder="Description" name="description" id="description">
</div>
<div class="number">
    <label for="number" />
    <input type="number" placeholder=1 name="number" id="number" min=1>
    //validation på at det er mindst 1, ellers toaster fejlbesked 
</div>
<div class="series">
    <label for="series" />
    <select placeholder="Series" name="series" id="series" required>
    <option value="">Select series</option>
    <option>Hardcoded option 2</option>
    <select {value}>
        {#each Object.entries(options) as [key, value] (key)}
            <option value={key}>
                {value}
            </option>
        {/each}
    </select>
    </select>
</div>
<div class="Release status">
    <input type="checkbox" name="unreleased" id="unreleased" required>
    <label for="unreleased">Unreleased</label>>
</div>
<div class="book_img">
    <label for="book_img" />
    <input type="text" placeholder="Image" name="img" id="book_img">
</div>
<div class="authors">
    <label for="authors" />
    <select placeholder="Author" name="authors" id="authors" multiple required>
    <option>Opret en getter til at få fat i author her?</option>
    <option>Hardcoded option 2</option>
    </select>
</div>
<div class="genres">
    <label for="genres" />
    <select placeholder="Genre" name="genres" id="genres" multiple required>
    <option>Opret en getter til at få fat i genre her?</option>
    <option>Hardcoded option 2. Et kald til database der henter genre og forfattere</option>
    </select>
</div>
</form>