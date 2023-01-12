<script>
    import StarRating from 'svelte-star-rating'
    export let review
</script>

<h4>{review.book_title}</h4>
<h5>{review.subject}</h5>
<StarRating rating={review.rating}></StarRating>
<p>{review.text}</p>