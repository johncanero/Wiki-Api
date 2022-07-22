//jshint esversion:6

// essentials
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const { response } = require("express");

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


///// REQUESTING TARGETING ALL ARTICLES /////



// EXPRESS - APP.ROUTE - SINGLE ROUT(CHAINED)
// REMOVE SEMICOLON WHEN CHAINING
app.route("/articles")


// EXPRESS - GET METHOD (REQUEST VERBS)
.get(function(req, res) {
    Article.find(function(err, foundArticles) {
        // console.log(foundArticles);
        // "If there were no errors ="
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
       
    });
})

// EXPRESS - POST METHOD (REQUEST VERBS)
.post(function(req, res) {
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
})


// EXPRESS - DELETE METHOD (REQUEST VERBS)
.delete(function(req, res) {
    Article.deleteMany(function(err){
        if(!err){
          res.send("Successfully deleted all articles.");
        }else{
           res.send(err);
        }
      });
});





///// REQUESTING SPECIFIC / INDIVIDUAL ARTICLES /////


// GET METHOD - FIND SPECIFIC ARTICLE
app.route("/articles/:articleTitle")

.get(function(req, res) {
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {
      if(foundArticle){
        res.send(foundArticle);
      }else{  
        res.send("No articles matching that title was found.");
      }
    });
  })


// PUT METHOD - UPDATING THE SPECIFIC WHOLE ARTICLE (IF NOT INCLUDED IN THE AMONG THE CONTENTS, ONLY THE CONTENTS YOU PROVIDED WOULD BE LISTED.)
  .put(function(req, res) {
    Article.findOneAndUpdate (
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
            if(!err) {
                res.send("Successfully updated the article.")
            } else {
                res.send(err);
            }
        });
  })

// PATCH METHOD - UPDATING A SPECIFIC PORTION OF THE ARTICLE

.patch(function(req, res){
    const articleTitle = req.params.articleTitle;

    Article.updateOne(
        {title: articleTitle},
        {$set: req.body},
        function(err){
            if(!err) {
                res.send("Successfully updated the content of the selected article.");
            } else {
                res.send(err);
            }
        });
});
  










app.listen(3000, function() {
  console.log("Server started on port 3000");
});
