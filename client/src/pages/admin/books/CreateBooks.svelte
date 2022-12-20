<script>
    import { user } from "../../../store/auth.js"
    import { useNavigate } from "svelte-navigator"
    import { BASE_URL } from "../../../store/globals.js";
    import * as Toastr from "toastr";

    
    if($user?.admin !== true) {
        const navigate = useNavigate()

        navigate("/")
    }
/*
    let value = 'foo'
	let options = {}

    function loadOptions() {
        options = {
            '': 'Please choose...',
            
        }
    }
*/

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
</div>
<div class="series">
    <label for="series" />
    <select placeholder="Series" name="series" id="series">
    <option value="">Select series</option>
    <option>Lord of the Rings</option>
    <!--
    <select {value}>
        {#each Object.entries(options) as [key, value] (key)}
            <option value={key}>
                {value}
            </option>
        {/each}
    </select>
    -->
    </select>
</div>
<div class="Release status">
    <input type="checkbox" name="unreleased" id="unreleased">
    <label for="unreleased">Unreleased</label>
</div>
<div class="book_img">
    <label for="book_img" />
    <input type="text" placeholder="Image" name="img" id="book_img">
</div>
<div class="authors">
    <label for="authors" />
    <select placeholder="Author" name="authors" id="authors" multiple required>
    <option>Holly Black</option>
    <option>J.R.R. Tolkien</option>
    <option>Sarah J. Maas</option>
    <option>Suzanne Collins</option>
    </select>
</div>
<div class="genres">
    <label for="genres" />
    <select placeholder="Genre" name="genres" id="genres" multiple required>
    <option>Adventure</option>
    <option>High Fantasy</option>
    <option>Romance</option>
    <option>Thriller</option>
    <option>Sci-fi</option>
    </select>
</div>
<div class="submit">
    <input type="submit" value="Create book" id="submit_button" />
</div>
</form>