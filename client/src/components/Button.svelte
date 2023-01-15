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
        margin-bottom: 10px;
        margin-top: 10px;
    }

    button:hover {
        color: wheat;
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
        font-size: x-large;
        padding: 5px 15px;   
	}

    .danger:hover {
        color: red;
    }

    .deleteUser {
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
        width: 115px;   
	}

    .deleteUser:hover {
        background-color: red;
    }

    .update {
        color: black;
        font-size: x-large;
    }

    .update:hover {
        color: green;
    }

    .save {
        font-size: 24px;
    }

    .create {
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
        width: 122px; 
    }

    .create:hover {
        background: #474544;
        color: #f2f3eb;
    }

    .goback {
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
        width: 122px;    
    }

    .goback:hover {
        background: #474544;
        color: #f2f3eb;
    }

</style>