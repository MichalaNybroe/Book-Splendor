<script>
    import { user } from '../../../store/auth.js'
    import { useNavigate } from 'svelte-navigator'

    
    if($user?.admin !== true) {
        const navigate = useNavigate()

        navigate('/')
    }
</script>