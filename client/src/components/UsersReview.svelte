<script>
    import StarRating from 'svelte-star-rating'
    export let review
</script>

<h4>{review.review_book_title}</h4>
<h5>{review.subject}</h5>
<StarRating rating={review.rating}></StarRating>
<p>{review.text}</p>

<style>
    h4 {
        margin-bottom: 10px;
        font-size: 18px;
    }

    h5 {
        font-size: 15px;
        margin-bottom: 10px;
    }

    p {
        font-size: 15px;
        max-width: 80%;
    }
</style>