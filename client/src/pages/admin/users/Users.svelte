<script>
    import { user } from "../../../store/auth.js"
    import { useNavigate } from "svelte-navigator"
    import { BASE_URL } from "../../../store/globals.js";
    import * as Toastr from "toastr";
    import { onMount } from "svelte";

    
    if($user?.admin !== true) {
        const navigate = useNavigate()

        navigate("/")
    }

    let users = []

    async function fetchUsers() {
        const response = await fetch(`${$BASE_URL}/api/users`, {
            credentials: "include"
        })

        if(response.ok) {
            const data = await response.json()
            users = data.data
        } else {
            Toastr.warning("Unable to retrieve users.")
        }
    }

    onMount(fetchUsers)

    


</script>


<table>
    <tr>
        <th></th>
    </tr>
</table>

<!--
{#each users as user}
    <User user={user} users={users}></User>
{/each}
-->
