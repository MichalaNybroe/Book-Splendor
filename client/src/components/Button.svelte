<script>
	
	let buttonProps = {
	class:[$$restProps.class]
	}
</script>

<svelte:head>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</svelte:head>


	<button on:click
			on:mouseover
			on:mouseenter
			on:mouseleave
		{...buttonProps}>
			<slot/>
	</button>

<style>
    button {
        background: none;
        border: none;
        color: #474544;
        cursor: pointer;
        display: inline-block;
        font-family: "Helvetica", Arial, sans-serif;
        font-size: 0.875em;
        font-weight: bold;
        outline: none;
        padding: 5px 15px;
    }

    button:hover {
        color: wheat;
    }

	.primary {
		color:green;
	}

    .login{
        background: none;
        border: solid 1px #474544;
        color: #474544;
        cursor: pointer;
        display: inline-block;
        font-family: "Helvetica", Arial, sans-serif;
        font-size: 0.875em;
        font-weight: bold;
        outline: none;
        padding: 5px 15px;
    }

    .login:hover {
        background: #474544;
        color: #f2f3eb;
    }

    .logout{
        color: #A3B18A;
        cursor: pointer;
        font-family: 'Habibi';
        font-size: 48px;
    }

    .logout:hover {
        color: black;
    }

	.danger {
		color:black;   
	}
    .danger:hover {
        background-color: red;
    }
	.sm {
		font-size:1em;
		padding:0.1em;
	}
	.lg {
		font-size:2em
	}
</style>