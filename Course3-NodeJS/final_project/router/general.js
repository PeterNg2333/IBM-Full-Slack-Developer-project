const express = require('express');
let books = require("./booksdb.js");
const e = require('express');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

  //convert the username to sting
  console.log(typeof username);
  password = String(password);

  if(username === "" || password === ""){
    return res.status(400).json({message: "Username or password cannot be empty"});
  }

  if (isValid(username)){
    users.push({username: "user1", password: "123"});
    console.log(users);
    return res.status(200).json({message: "User created successfully"});
  }
  else{
    return res.status(400).json({message: "Invalid username"});
  }
  
});

public_users.get("/register.html", (req,res) => {
  //Write your code here
  return res.status(200).sendFile(__dirname + "/register.html");
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  // Read json from booksdb.js
  let books = require("./booksdb.js");
  return res.status(200).json(JSON.stringify(books));

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;

  // Read json from booksdb.js
  let books = require("./booksdb.js");

  // filter the books based on the isbn
  if(books[isbn]){
      return res.status(200).json(books[isbn]);
  }
  else{
    return res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  // get the author from the request
  let author = req.params.author;

  // Read json from booksdb.js
  let books = require("./booksdb.js");
  
  // filter the books based on the author
  for (const book in books) {
    if(books[book].author === author){
      return res.status(200).json(books[book]);
    }
  }

  return res.status(404).json({message: "Author not found"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;

  // Read json from booksdb.js
  let books = require("./booksdb.js");

  // filter the books based on the title
  for (const book in books) {
    if(books[book].title === title){
      return res.status(200).json(books[book]);
    }
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;

  // Read json from booksdb.js
  let books = require("./booksdb.js");

  // filter the books based on the isbn
  if(books[isbn]){
      return res.status(200).json(books[isbn].reviews);
  }
  else{
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
