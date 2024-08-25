const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    name: String,
    title: String,
    message: String,
    date: Date,
    likeCount: Number,
    comments: String
});

const Post = mongoose.model("Post" , postSchema);


module.exports = Post;