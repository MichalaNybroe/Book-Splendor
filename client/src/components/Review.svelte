<script>
    import StarRating from 'svelte-star-rating'
    export let review
</script>

<img src="/profilPictures/{review.user_picture}.png" alt="Profile." width="50 ">
<p>{review.username}</p>
<StarRating rating={review.rating}></StarRating>
<h5>{review.subject}</h5>
<p>{review.text}</p>