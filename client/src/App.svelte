<script>
  
  //why?????????????
  import { Router, Link, Route } from "svelte-navigator";

  import Home from "./pages/home/Home.svelte";
  import Registration from "./pages/registration/Registration.svelte";
  import Login from "./pages/login/Login.svelte";
  import Contact from "./pages/contact/Contact.svelte";
</script>

<Router>
  <nav>
<!--    <h1>Book-Splendor <img src="/public/favicon.png" alt="Book-Splendor icon" height="40px"> </h1> -->
<h1 class="margin-left">
  <img src="/public/favicon.png" alt="Book-Splendor icon" height="50px"> <Link to="/">Home</Link>
    <Link to="/login">Login</Link>
    <Link to="/registration">Registration</Link>
    <Link to="/contact">Contact</Link>
  </nav>
  <div>
    <Route path="/"><Home /></Route>
    <Route path="/login"><Login /></Route>
    <Route path="/registration"><Registration /></Route>
    <Route path="/contact"><Contact /></Route>
</div>
</Router>

<main class="margin-left">
</main>

<style>
  .margin-left {
    margin-left: 5px
  }
</style>
