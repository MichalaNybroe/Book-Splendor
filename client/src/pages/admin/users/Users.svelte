<script>
    import { user } from '../../../store/auth.js'
    import { useNavigate } from 'svelte-navigator'
    import { BASE_URL } from '../../../store/globals.js'
    import * as Toastr from 'toastr'
    import '../../../../node_modules/toastr/build/toastr.css'

    
    if($user?.admin !== true) {
        const navigate = useNavigate()

        navigate('/')
    }

    let users = []

    async function fetchUsers() {
        const response = await fetch(`${$BASE_URL}/api/users`, {
            credentials: 'include'
        })

        if(response.ok) {
            const data = await response.json()
            users = data.data.map((user) => Object.values(user))
        } else {
            Toastr.warning('Unable to retrieve users.')
        }
    }


    fetchUsers()

    let columns = ['Id', 'Email', 'Username']
	
	async function deleteRow(rowToBeDeleted) {
        try {
            //confirm message before try 'Are you sure you wish to delete' in TOASTR
            const response = await fetch(`${$BASE_URL}/api/users/${rowToBeDeleted[0]}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            })

            if (!response.ok) {
                const json = await response.json()
                Toastr.warning(json.message)
                return
            }

            users = users.filter(row => row != rowToBeDeleted)
        } catch {
            Toastr.error('Unable to delete user. Try again later.')
	    }
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
			<td>{cell}</td>
			{/each}
			<button on:click={() => deleteRow(row)}>
				X
			</button>
		</tr>
	{/each}
</table>


<style>
     table {
        margin-left: 5%;
    }
</style>
