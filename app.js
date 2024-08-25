const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const Post = require("./models/blog.js");
const path = require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname , "/public")));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.set("views engine" , "ejs");
app.set("views" , path.join(__dirname , "/views"));

main()
    .then(res => console.log("connection generated"))
    .catch(err => console.log(err));


async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/posts");
}


// index route
app.get("/posts" ,async (req,res) => {

    let posts = await Post.find({});
    res.render("index.ejs" , {posts});
})

// new post route
app.get("/posts/new" , (req,res) => {

    res.render("new.ejs");
})

app.post("/posts" , (req,res) => {

    let {name ,title , message} = req.body;
    let newDate = new Date();

    let newPost = new Post({
        name: name,
        title: title,
        message: message,
        date: newDate,
        likeCount: 0
    })

    newPost.save()
        .then(result => {
            res.redirect("/posts");
        })
        .catch(err => console.log(err));
});




// edit route

app.get("/posts/:id/edit" ,async (req,res) => {

    let {id} = req.params;

    let post = await Post.findById(id);
    res.render("edit.ejs" , {post});
})

app.put("/posts/:id" , (req,res) => {
    let {id} = req.params;
    let {message} = req.body;
    Post.findOneAndUpdate({_id: id} , {message: message})
        .then(result => {
            res.redirect("/posts")
        })
        .catch(err => console.log(err));
})

app.post("/posts/:id/like" ,async (req,res) => {
    let {id} = req.params;
    let post = await Post.findById(id);
    Post.findOneAndUpdate({_id: id} , {likeCount: post.likeCount + 1})
        .then(result => {
            res.redirect("/posts");
        })
        .catch(err => console.log(err));
    
});


// ROOT PAGE
app.get("/" , (req , res) => {
    res.render("welcome.ejs");
});




app.listen(port , () => {
    console.log(`listening at port ${port}`);
});