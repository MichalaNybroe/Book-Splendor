<script>
    import StarRating from 'svelte-star-rating'
    export let review
</script>
<div id="review">
    <div id="userReview">
        <img src="/profilPictures/{review.user_picture}.png" alt="Profile." width="40">
        <p id="username">{review.username}</p>
        <br>
    </div>
    <div id="reviewDiv">
        <StarRating rating={review.rating}></StarRating>
        <h5>{review.subject}</h5>
        <p>{review.text}</p>
    </div>
</div>


<style>
    img {
        border-radius: 50%;
        border: 1px solid rgb(213, 211, 211);
    }

    #review {
        display: block;
        margin-bottom: 20px;
    }

    #userReview {
        display: flex;
        gap: 10px;
        margin-bottom: 10px;
    }

    #username {
        align-self: center;
    }

    #reviewDiv h5{
        margin-bottom: 10px;
    }
</style>