<script>
    import BooksBy from '../../components/BooksBy.svelte'
    export let id
</script>

<div>
    <BooksBy endpoint={'genres'} id={id}></BooksBy>
</div>


<style>
    div {
        width: 100%;
        display: flex;
        margin-bottom: 5%;
    }
</style>