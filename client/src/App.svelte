<script>
  import Navbar from "./components/Navbar.svelte"
  import Footer from "./components/Footer.svelte"

  import { Route, Router } from "svelte-navigator"

  import Home from "./pages/home/Home.svelte"
  import Login from "./pages/login/Login.svelte"
  import Contact from "./pages/contact/Contact.svelte"
  import Books from "./pages/books/Books.svelte"
</script>

<main class="margin-left">
  <Router>
    <Navbar></Navbar>

      <div>
        <Route path="/"><Home /></Route>
        <Route path="/login"><Login /></Route>
        <Route path="/contact"><Contact /></Route>
        <Route path="/books"><Books /></Route>
      </div>

    <Footer></Footer>
  </Router>
</main>

<style>
  .margin-left {
    margin-left: 5px
  }
</style>
