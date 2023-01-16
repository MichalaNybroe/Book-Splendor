<script>
    import AdminList from '../../../components/AdminList.svelte'
</script>

<AdminList endpoint={'users'} single={'user'} columns={['Id', 'Email', 'Username']} header={'Users'}></AdminList>
