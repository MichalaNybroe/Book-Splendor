<script>
    import { useNavigate } from "svelte-navigator"
    import { user } from "../../store/auth.js"

    
    if($user.admin === true || $user === null) {
        const navigate = useNavigate()

        navigate("/")
    }
</script>