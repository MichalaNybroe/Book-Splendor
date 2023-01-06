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

	.primary{
		color:green;
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

<!--OBS: husk at importe button, like this: import Button from "./Button.svelte" -->