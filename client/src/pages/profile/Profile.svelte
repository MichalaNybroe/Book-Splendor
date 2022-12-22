<script>
    import { Router, Link, useNavigate } from "svelte-navigator"
    import { user } from "../../store/auth.js"
    import * as Toastr from "toastr"
    import '../../../node_modules/toastr/build/toastr.css'

    //colorchange with socket:
    import { colorChangesList } from "../../store/colorChangesList"
    import ColorChangesWidget from "../../components/ColorChangesWidget/ColorChangesWidget.svelte"
    import io from "socket.io-client";
    import { BASE_URL } from "../../store/globals.js"
    
    
    if ($user === null || $user.admin === true) {
        const navigate = useNavigate()

        navigate("/")
    }

    function saveColor() {
        const colorInp = document.getElementById("colorInp")
        const body = { color: colorInp.value }

        fetch(`${$BASE_URL}/api/users/${$user.id}`, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        }).then((response) => {
            if (response.ok) {
                Toastr.success("Banner color updated.")
                user.update(color => color)
            } else {
                Toastr.warning("Banner color update was unsuccessfull.")
            }
        }).catch(() => {
            Toastr.error("Unable to update banner color. Try again later.")
        })
    }
    /*let colorValue = "#000000";
    
    const socket = io();
    socket.on("update color", (data) => {
        document.body.style.backgroundColor = data.data;
        colorChangesList.update((currentColorChangesList) => {
            return [data, ...currentColorChangesList];
        });
    });
    function sendColor() {
        socket.emit("client choose a new color", { data: colorValue });
    }*/
    
    
</script>

<div id="profilebanner" style="background-color: {$user.color};color:white">
    <img id="profilePicture">

    <h3 id="username">{$user?.user_name}</h3>
    <input type="color" bind:value={$user.color} style="height: 50px;" on:change={saveColor} id="colorInp">
</div>

<div id="toReadList">

</div>

<div id="readList">

</div>


<p>mark as</p>
<p>read</p>
<p>want to read</p>
<p>reviews</p>

<!--<input bind:value={colorValue} type="color">
<button on:click={sendColor}>Choose color</button>-->


<ColorChangesWidget />

<Router primary={false}>
    <Link to="/invite">Invite a friend?</Link>
</Router>