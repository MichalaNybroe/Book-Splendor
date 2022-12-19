<script>
    import { useNavigate } from "svelte-navigator"
    import { user } from "../../store/auth.js"

    
    if($user.admin === true || $user === null) {
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
<p>wnt to read</p>
<p>se alle egne reviews</p>