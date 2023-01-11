<script>
    import { user } from '../store/auth.js'
    import { useNavigate } from 'svelte-navigator'
    import { BASE_URL } from '../store/globals.js'
    import * as Toastr from 'toastr'
    import '../../node_modules/toastr/build/toastr.css'
    import { Confirm } from 'svelte-confirm'

    if($user?.admin !== true) {
        const navigate = useNavigate()

        navigate('/')
    }

    export let endpoint
    export let single
    export let columns
    let list = []

    async function fetchList() {
        try {
            const response = await fetch(`${$BASE_URL}/api/${endpoint}`, {
                credentials: 'include'
            })
            const data = await response.json()
            list = data.data.map((element) => Object.values(element))
        } catch {
            Toastr.warning(`Unable to retrieve ${endpoint}.`)
        }
    }

    fetchList()
	
	async function deleteRow(rowToBeDeleted) {
        try {
            const response = await fetch(`${$BASE_URL}/api/${endpoint}/${rowToBeDeleted[0]}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            })

            // Do we need this?
            if (!response.ok) {
                const json = await response.json()
                Toastr.warning(json.message)
                return
            }

            list = list.filter(row => row != rowToBeDeleted)
        } catch {
            Toastr.error(`Unable to delete ${single}. Try again later.`)
	    }
    }
</script>

<table>
	<tr>
		{#each columns as column}
			<th>{column}</th>
		{/each}
	</tr>
	
	{#each list as row}
		<tr>
			{#each row as cell}
			<td>{cell}</td>
			{/each}
            <Confirm
                confirmTitle="Delete"
                themeColor="110"
                let:confirm="{confirmThis}"
            >
                <button on:click={() => confirmThis(deleteRow, row)}>
                    X
                </button>
            </Confirm>
		</tr>
	{/each}
</table>
