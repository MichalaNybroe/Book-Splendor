<script>
    import { colorChangesList } from '../../store/colorChangesList'
    
</script>

<div id="colors-changes-widget">
{#each $colorChangesList as colorChange}
    <div style="background-color: {colorChange.data}">
        {colorChange.username} ---- {colorChange.data}
    </div>
{/each}
</div>

<style>
#colors-changes-widget {
    margin: 1em;
    border: 0.1em solid white;
    min-width: 40vw;
    min-height: 60vh;
    max-height: 60vh;
    overflow-y: scroll;
}
</style>