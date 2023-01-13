<script>
    import AdminList from '../../../components/AdminList.svelte'
</script>

<AdminList endpoint={'reviews'} single={'review'} columns={['id', 'subject', 'text', 'rating', 'User Id', 'Book Id']} header={'Reviews'}></AdminList>