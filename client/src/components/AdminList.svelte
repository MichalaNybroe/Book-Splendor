<script>
    import { user } from '../store/auth.js'
    import { useNavigate } from 'svelte-navigator'
    import { BASE_URL } from '../store/globals.js'
    import * as Toastr from 'toastr'
    import '../../node_modules/toastr/build/toastr.css'
    import { Confirm } from 'svelte-confirm'
    import PageHeader from './PageHeader.svelte'

    if($user?.admin !== true) {
        const navigate = useNavigate()

        navigate('/')
    }

    export let endpoint
    export let single
    export let columns
    export let header
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

<PageHeader header={header}></PageHeader>
<table>
	<tr>
		{#each columns as column}
			<th>{column}</th>
		{/each}
        <th>Delete</th>
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
                <button class="danger" on:click={()=> confirmThis(deleteRow, row)}>
                    <i class="w3-margin-left fa fa-trash"></i>
                </button>
            </Confirm>
		</tr>
	{/each}
</table>

<style>
   .danger {
       color:black;
       font-size: x-large;
       padding: 5px 15px;   
   }

   .danger:hover {
       color: red;
       background-color: white;
   }

   button {
       background: none;
       border: none;
       color: #474544;
       cursor: pointer;
       display: inline-block;
       font-family: "Helvetica", Arial, sans-serif;
       font-size: 0.875em;
       font-weight: bold;
       outline: none;
       padding: 5px 15px;
   }

   button:hover {
       background: #474544;
       color: #f2f3eb;
   }

   table {
       padding: 37.5px;
   }

   table {
       width: 90%;
   }

   tr {
       text-align: left;
   }

   td {
    border-top: 1px solid #EEE;
   }
</style>