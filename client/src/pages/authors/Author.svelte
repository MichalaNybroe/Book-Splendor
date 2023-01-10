<script>
    import BooksBy from '../../components/BooksBy.svelte'
    export let id
</script>

<BooksBy endpoint={'authors'} id={id}></BooksBy>