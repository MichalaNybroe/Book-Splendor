<script>
    export let serie
    let yes = false
</script>

<input type="checkbox" value="{serie.title}" name="{serie.title} bind:checked={yes}">
<label for="{serie.title}">{serie.title}</label>