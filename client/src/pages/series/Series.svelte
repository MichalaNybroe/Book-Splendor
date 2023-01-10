<script>
    import BooksBy from '../../components/BooksBy.svelte'
    export let id
</script>

<BooksBy endpoint={'series'} id={id}></BooksBy>