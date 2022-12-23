<script>
    import { user } from "../../../store/auth.js"
    import { useNavigate } from "svelte-navigator"
    import { BASE_URL } from "../../../store/globals.js"
    import * as Toastr from "toastr"
    import { onMount } from "svelte"

    
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
            users = data.data.map((user) => Object.values(user))
        } else {
            Toastr.warning("Unable to retrieve users.")
        }
    }


    onMount(fetchUsers)

    let columns = ["Id", "Email", "Username"]
	
	function deleteRow(rowToBeDeleted) {
		users = users.filter(row => row != rowToBeDeleted)
	}


</script>

<table>
	<tr>
		{#each columns as column}
			<th>{column}</th>
		{/each}
	</tr>
	
	{#each users as row}
		<tr>
			{#each row as cell}
			<td contenteditable="true" bind:textContent={cell} />
			{/each}
			<button on:click={() => deleteRow(user)}>
				X
			</button>
		</tr>
	{/each}
</table>
