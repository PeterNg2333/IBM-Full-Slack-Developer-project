const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if the user is authenticated
  console.log(users);
  return true;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  
  let username = req.body.username;
  let password = req.body.password;

  if(username === "" || password === ""){
    return res.status(400).json({message: "Username or password cannot be empty"});
  }

  if (authenticatedUser(username,password)){
    let token = jwt.sign({username: username}, "fingerprint_customer");
    return res.status(200).json({message: "Login successful", token: token});
  }
  else{
    return res.status(400).json({message: "Invalid username or password"});
  }
});

regd_users.get("/login.html", (req,res) => {
  //Write your code here
  return res.status(200).sendFile(__dirname + "/login.html");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
