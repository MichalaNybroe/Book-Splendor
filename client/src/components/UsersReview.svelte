<script>
    import StarRating from 'svelte-star-rating'
    export let review
    console.log(review)
</script>

<h4>{review.review_book_title}</h4>
<h5>{review.subject}</h5>
<StarRating rating={review.rating}></StarRating>
<p>{review.text}</p>