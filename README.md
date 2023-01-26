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
![image](https://user-images.githubusercontent.com/82261201/214863665-e64ee497-c53b-493c-b234-bef96345cc66.png)
![image](https://user-images.githubusercontent.com/82261201/214863875-6c4aadc3-be94-4042-af16-56caa194cc36.png)
![image](https://user-images.githubusercontent.com/82261201/214081452-45d2246f-229c-4698-8ddd-8c772a34f439.png)
 
### Display all books in genre, by author or in series
- Besides being able to see all books one is also able to see all books by a certain author, in a certain genre og in a certain series.
![image](https://user-images.githubusercontent.com/82261201/214864022-a4bcf553-2b67-4906-9445-9c0c5f82454b.png)
 ![image](https://user-images.githubusercontent.com/82261201/214083054-081e07b7-e47d-49db-969f-7c9741f7e0be.png)

### Users profilepage
- The profilepage displays the books the user have marked as either want to read or have read books. Besides this they might also see the reviews they have made.
  ![image](https://user-images.githubusercontent.com/82261201/214864638-e8632814-9719-444e-82b4-40c0a22c0cc3.png)
- If the user wants to configure their profile they can change their username, banner color and their profile picture. They might also both update their password or delete their own profile.
  ![image](https://user-images.githubusercontent.com/82261201/214864776-fb67ecb9-0283-4ade-9f3d-58d849f04276.png)

### Specific book page
- Display book information and their average rating while also displaying the books reviews. At the bottom of the page - if one is logged in one might leave a review (only one pr. user) and underneath the book information a user can add a book to their read list og to read list.
  ![image](https://user-images.githubusercontent.com/82261201/214865451-ed670ac1-7756-4b06-b7b3-3781f6faff68.png)
  ![image](https://user-images.githubusercontent.com/82261201/214864929-ae1b1818-2f43-4e85-bfba-5f1cfbaa212f.png)

### Admin
- An admin can see and delete reviews, users and books.
  ![image](https://user-images.githubusercontent.com/82261201/214865635-57b5bd90-c182-4ede-8410-856af4f372f6.png)
  ![image](https://user-images.githubusercontent.com/82261201/214865742-c4fd486b-d17e-483f-a346-ffdf4a60d578.png)
- While displaying books the admin might filter them by series or book title, by id and by author name. Besides this the admin can easily recommend books for the book of the week banner on the homepage. It is also here the admin might update certain books.
  ![image](https://user-images.githubusercontent.com/82261201/214865902-24f56df7-95b1-4894-958c-71a5b568d9bf.png)
  ![image](https://user-images.githubusercontent.com/82261201/214866044-558c6df5-3a99-488f-a3ae-839833023018.png)
  ![image](https://user-images.githubusercontent.com/82261201/214866118-9399172d-d6ef-4468-a2b9-7b81866e5c7b.png)
  
  Recommend
  ![image](https://user-images.githubusercontent.com/82261201/214866463-f94c25c7-8874-4a92-9b16-15dcd86bfa62.png)

  
  Update
  ![image](https://user-images.githubusercontent.com/82261201/214866344-17055bea-b488-4d31-870d-5558e61ae222.png)

- Clicking on create book the admin can create a new book and on here they might also click on util to create a series, an author or a genre. This is meant to increase the user experience for when new books are to be registered to the platform.
  ![image](https://user-images.githubusercontent.com/82261201/214866698-8bc06999-24e2-4029-bbc1-ebc9d750de6d.png)
  ![image](https://user-images.githubusercontent.com/82261201/214866877-eafc83ae-ed50-4829-8e41-150381945daa.png)


### Other
- One might sign up as a normal user.
- One might apply for new password via email.
- One might send a message to the admin team.
- Via use of sockets one might see new reviews in real time being displayed on the different books.
![image](https://user-images.githubusercontent.com/82261201/214866968-0c5937e0-d646-4ce9-ad9f-0e286aac02fb.png)
![image](https://user-images.githubusercontent.com/82261201/214867049-6ff9c60c-a364-4665-9384-26fc953b4deb.png)
![image](https://user-images.githubusercontent.com/82261201/214867140-c0787b07-cc3e-4fb2-8e05-a532d38efec9.png)
![image](https://user-images.githubusercontent.com/82261201/214864228-79841c5c-25ad-466a-bdb3-983fc94a0431.png)
![image](https://user-images.githubusercontent.com/82261201/214867924-2de79fb1-dbd6-4f5f-87a4-ad9fdc9ca9bd.png)
![image](https://user-images.githubusercontent.com/82261201/214868002-3738ff9a-5a8f-459c-ab14-25ce00cac785.png)


## Collaborators
Silke Jensen [silkemarie](https://github.com/silkemarie)  
Michala Nybroe [MichalaNybroe](https://github.com/MichalaNybroe)  

