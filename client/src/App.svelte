<script>
  import Navbar from './components/Navbar.svelte'
  import Footer from './components/Footer.svelte'

  import { Route, Router } from 'svelte-navigator'

  import Home from './pages/home/Home.svelte'
  import Login from './pages/login/Login.svelte'
  import Contact from './pages/contact/Contact.svelte'
  import Books from './pages/books/Books.svelte'
  import SignUp from './pages/signup/SignUp.svelte'
  import ForgotPassword from './pages/forgotpassword/ForgotPassword.svelte'
  import ManageBooks from './pages/admin/books/Books.svelte'
  import ManageUsers from './pages/admin/users/Users.svelte'
  import ManageReviews from './pages/admin/reviews/Reviews.svelte'
  import ManageCreateBooks from './pages/admin/books/CreateBooks.svelte'
  import Profile from './pages/profile/Profile.svelte'
  import Book from './pages/books/Book.svelte'
  import AuthorBooks from './pages/authors/Author.svelte'
  import GenreBooks from './pages/genres/Genre.svelte'
  import SeriesBooks from './pages/series/Series.svelte'
  import UpdateBooks from './pages/admin/books/UpdateBooks.svelte'
</script>

<main>
  <Router>
    <Navbar></Navbar>

      <div id="content">
        <Route path="/"><Home /></Route>
        <Route path="/login"><Login /></Route>
        <Route path="/contact"><Contact /></Route>
        <Route path="/books"><Books /></Route>
        <Route path="/signUp"><SignUp /></Route>
        <Route path="/forgotPassword"><ForgotPassword /></Route>
        <Route path="/admin/books"><ManageBooks /></Route>
        <Route path="/admin/users"><ManageUsers /></Route>
        <Route path="/admin/reviews"><ManageReviews /></Route>
        <Route path="/profile"><Profile /></Route><!--kan evt tilføje /id så andre kan tilgå hinandens sider. men sikkerhedstjek at man kun kan redigere hvis man er brugeren selv-->
        <Route path="/admin/books/create"><ManageCreateBooks /></Route>
        <Route path="/admin/books/:id/update" component='{UpdateBooks}'/>
        <Route path="/book/:id" component='{Book}'/>
        <Route path="/authors/:id/books" component='{AuthorBooks}'/>
        <Route path="/genres/:id/books" component='{GenreBooks}'/>
        <Route path="/series/:id/books" component='{SeriesBooks}'/>
      </div>

    <Footer></Footer>
  </Router>
</main>

<style>
  #content {
    margin: 70px 180px;
  }

  body {
    min-height: 100%;
  }
</style>
