<script>
    import { Router, Link, useNavigate } from "svelte-navigator"
    import { user, user_admin } from "../../store/auth.js"

    //colorchange with socket:
    import { colorChangesList } from "../../store/colorChangesList";
    import ColorChangesWidget from "../../components/ColorChangesWidget/ColorChangesWidget.svelte";
    import io from "socket.io-client";
    
    let colorValue = "#000000";
    
    const socket = io();
    socket.on("update color", (data) => {
        document.body.style.backgroundColor = data.data;
        colorChangesList.update((currentColorChangesList) => {
            return [data, ...currentColorChangesList];
        });
    });
    function sendColor() {
        socket.emit("client choose a new color", { data: colorValue });
    }

    
    if($user_admin !== null || $user === null) {
        const navigate = useNavigate()

        navigate("/")
    }
</script>

<div id="profilebanner">
    <img id="profilePicture">

    <h3 id="username">{user.user_name}</h3>
</div>

<div id="toReadList">

</div>

<div id="readList">

</div>


<p>mark as</p>
<p>read</p>
<p>want to read</p>
<p>reviews</p>

<input bind:value={colorValue} type="color">
<button on:click={sendColor}>Choose color</button>


<ColorChangesWidget />

<Router primary={false}>
    <Link to="/invite">Invite a friend?</Link>
</Router>