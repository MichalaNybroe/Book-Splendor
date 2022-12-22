<script>
  import Navbar from "./components/Navbar.svelte"
  import Footer from "./components/Footer.svelte"

  import { Route, Router } from "svelte-navigator"
  import io from "socket.io-client"
  import { BASE_URL, ENVIRONMENT } from "./store/globals";
  import { onMount } from "svelte";

  import Home from "./pages/home/Home.svelte"
  import Login from "./pages/login/Login.svelte"
  import Contact from "./pages/contact/Contact.svelte"
  import Books from "./pages/books/Books.svelte"
  import SignUp from "./pages/signup/SignUp.svelte"
  import ForgotPassword from "./pages/forgotpassword/ForgotPassword.svelte"
  import ManageBooks from "./pages/admin/books/Books.svelte"
  import ManageUsers from "./pages/admin/users/Users.svelte"
  import ManageReviews from "./pages/admin/reviews/Reviews.svelte"
  import ManageCreateBooks from "./pages/admin/books/CreateBooks.svelte"
  import Profile from "./pages/profile/Profile.svelte"
  import Book from "./pages/books/Book.svelte"
  import AuthorBooks from "./pages/authors/Author.svelte"
  import GenreBooks from "./pages/genres/Genre.svelte"
  import SeriesBooks from "./pages/series/Series.svelte"
    import Series from "./components/Series.svelte";
  
/*
  const socket = io();
    onMount(async () => {
        if ($ENVIRONMENT === "DEVELOPMENT") {
            socket.on("update the page", () => {
                location.reload()
            });
        }
 
        const response = await fetch($BASE_URL + "/profile")
    });
    */

</script>

<main class="margin-left">
  <Router>
    <Navbar></Navbar>

      <div>
        <Route path="/"><Home /></Route>
        <Route path="/login"><Login /></Route>
        <Route path="/contact"><Contact /></Route>
        <Route path="/books"><Books /></Route>
        <Route path="/signUp"><SignUp /></Route>
        <Route path="/forgotPassword"><ForgotPassword /></Route>
        <Route path="/admin/books"><ManageBooks /></Route>
        <Route path="/admin/users"><ManageUsers /></Route>
        <Route path="/admin/reviews"><ManageReviews /></Route>
        <Route path="/profile"><Profile /></Route>
        <Route path="/admin/books/create"><ManageCreateBooks /></Route>
        <Route path="/book"><Book /></Route>
        <Route path="/authors/books"><AuthorBooks /></Route>
        <Route path="/genres/books"><GenreBooks /></Route>
        <Route path="/series/books"><SeriesBooks /></Route>
        
      </div>

    <Footer></Footer>
  </Router>
</main>

<style>
  .margin-left {
    margin-left: 5px
  }
</style>
