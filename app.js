//jshint esversion:6

// essentials
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

// MONGO CLIENT
const MongoClient = require('mongodb').MongoClient


// essentials: express
const app = express();

// template ejs
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// MONGOOSE CONNECT
mongoose.connect('mongodb://localhost:27017/wikiDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true 
}, err => err ? console.log(err) : console.log('Connected to database'));


// MONGOOSE - ITEMS SCHEMA
const articleSchema = mongoose.Schema({
    title: String,
    content: String,
});

const Article = mongoose.model("Article", articleSchema);


///// ALL ARTICLES /////

// EXPRESS - GET METHOD (REQUEST VERBS)
app.get("/articles", function(req, res) {
    Article.find(function(err, foundArticles) {
        // console.log(foundArticles);
        // "If there were no errors ="
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
       
    });
});



// EXPRESS - POST METHOD (REQUEST VERBS)
app.post("/articles", function(req, res) {
    // console.log(req.body.title);
    // console.log(req.body.content);

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err) {
        if(!err) {
            res.send("Successfully added a new article.")
        } else {
            res.send(err);
        }
    });
});

// EXPRESS - DELETE METHOD (REQUEST VERBS)
app.delete("/articles", function(req, res) {
    Article.deleteMany(function(err){
        if(!err){
          res.send("Successfully deleted all articles.");
        }else{
           res.send(err);
        }
      });
}); 




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
