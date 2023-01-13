<script>
    import AdminList from '../../../components/AdminList.svelte'
</script>

<AdminList endpoint={'users'} single={'user'} columns={['id', 'email', 'username']} header={'Users'}></AdminList>
