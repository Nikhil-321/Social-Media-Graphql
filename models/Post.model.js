const mongoose = require("mongoose")

const PostSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true
    },

    createdAt: {
        type: String,
        required: true
    },
    // image: {
    //   type: String,
    //   required: false  
    // },

    comments: [
        {
            comment: String,
            username: String,
            createdAt: String
        }
    ],

    likes: [
        {
            username: String,
            createdAt: String
        }
    ],

    user: {
        type: mongoose.Schema.Types.ObjectId, ref: "user",
        required: true
    }

})

const Post = mongoose.model("post",  PostSchema)
module.exports = Post