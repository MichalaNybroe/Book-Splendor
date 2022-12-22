<script>
    export let author
    let yes = false
</script>

<input type="checkbox" value="{author.name}" name="{author.name}" bind:checked={yes}>
<label for="{author.name}">{author.name}</label>