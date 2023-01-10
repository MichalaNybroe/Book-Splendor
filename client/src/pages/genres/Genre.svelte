<script>
    import BooksBy from '../../components/BooksBy.svelte'
    export let id
</script>

<BooksBy endpoint={'genres'} id={id}></BooksBy>