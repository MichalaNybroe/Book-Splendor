<script>
    export let genre 
    let yes = false
</script>

<input type="checkbox" value="{genre.name}" name="{genre.name} bind:checked={yes}">
<label for="{genre.name}">{genre.name}</label>