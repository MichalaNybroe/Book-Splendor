<script>
    import AdminList from '../../../components/AdminList.svelte'
</script>

<AdminList endpoint={'reviews'} single={'review'} columns={['Id', 'Subject', 'Text', 'Rating', 'User Id', 'Book Id']} header={'Reviews'}></AdminList>