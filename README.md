# Book-Splendor
Exam project in NodeJs.
[Link to exam project description.](https://docs.google.com/document/d/1j1CeNNemhCCEhuVvSgk5E1cxRZFJT5AY8TkRGTp2428/edit#)

The idea of the project is to create a website for book enthusiasts both to keep track of their own reading lists, to explore other reads and potentially have a network of friends - whose brain is also full of amazing stories!

## Set-up

### Server
1. Create .env file in image of .env.sample.
2. Install dependencies from package.json `npm i`
3. Run ddl file to create database `node .\database\ddl.js`
4. Start server `node app.js`

### Client
1. Install dependencies from package.json `npm i`
2. Build client `npm run build`
3. Preview `npm run preview`

Alternatively you might want to work with the project as in development using `nodemon.cmd .\app.js` in server and `npm run dev` in client.

## Features

### Homepage
- Banner display of recommended book of the week. Display of five random books in different genres. This page is designed to give users a chance to be exposed to books to read - and the books not being the newest or necessarily hottest.
![image](https://user-images.githubusercontent.com/82261201/214081452-45d2246f-229c-4698-8ddd-8c772a34f439.png)
   PICTURE OF WHOLE FRONTPAGE
 
### Display all books in genre, by author or in series
- Besides being able to see all books one is also able to see all books by a certain author, in a certain genre og in a certain series. 
 ![image](https://user-images.githubusercontent.com/82261201/214083054-081e07b7-e47d-49db-969f-7c9741f7e0be.png)

### Users profilepage
- The profilepage displays the books the user have marked as either want to read or have read books. Besides this they might also see the reviews they have made.
  PICTURE
- If the user wants to configure their profile they can change their username, banner color and their profile picture. They might also both update their password or delete their own profile.
  PICTURE

### Specific book page
- Desplay book information and their average rating while also displaying the books reviews. At the bottom of the page - if one is logged in one might leave a review (only one pr. user) and underneath the book information a user can add a book to their read list og to read list.
  PICTURE

### Admin
- An admin can see and delete reviews, users and books.
  PICTURE REVIEWS AND USERS
- While displaying books the admin might filter them by series or book title, by id and by author name. Besides this the admin can easily recommend books for the book of the week banner on the homepage. It is also here the admin might update certain books.
  PICTURE BOOK FILTER
  BOOK UPDATE
- Clicking on create book the admin can create a new book and on here they might also click on util to create a series, an author or a genre. This is meant to increase the user experience for when new books are to be registered to the platform.
  PICTURE + PICTURE

### Other
- One might sign up as a normal user.
- One might apply for new password via email.
- One might send a message to the admin team.
- Via use of sockets one might see new reviews in real time being displayed on the different books.
  PICTURES

## Collaborators
Silke Jensen [silkemarie](https://github.com/silkemarie)  
Michala Nybroe [MichalaNybroe](https://github.com/MichalaNybroe)  

