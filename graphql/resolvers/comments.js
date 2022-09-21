const { AuthenticationError } = require("apollo-server")
const authMiddleware = require("../../middleware/auth")
const Post = require("../../models/Post.model")
const User = require("../../models/User.model")


module.exports = {
    Mutation: {
        createComment: async (_, {postId, comment}, context) => {
            try {
                const user = authMiddleware(context)
                const userDetails = await User.findById(user.userId)
                const post = await Post.findById(postId)
                if(!post) throw new Error("Post not found")
                post.comments.unshift({
                    comment,
                    username: userDetails.userName,
                    createdAt: new Date().toISOString()
                })
                await post.save()
                return post.comments[0]
            } catch (error) {
                console.log("error", error)
                throw new Error(error)
            }
        },

        editComment: async (_, {postId, commentId, comment}, context) => {
            try {
                const user = authMiddleware(context)
                const userDetails = await User.findById(user)
                const post = await Post.findById(postId)
                if(!post) throw new Error("Post not found")
                const foundComment = post.comments.find(e => e.id === commentId)
                if(foundComment.username === userDetails.userName) {
                    foundComment.comment = comment
                    await post.save()
                    return foundComment
                } else {
                    throw new AuthenticationError("Action not allowed")
                }
            } catch (error) {
                console.log("error", error)
                throw new Error(error)
            }
        },

        deleteComment: async (_, {postId, commentId}, context) => {
            try {
                const user = authMiddleware(context)
                const userDetails = await User.findById(user.userId)
                const post = await Post.findById(postId)
                if(!post) throw new Error("Post not found")
                const commentIndex = post.comments.findIndex(e => e.id === commentId)
                if(post.comments[commentIndex].username === userDetails.userName) {
                    post.comments.splice(commentIndex, 1)
                    await post.save()
                    return "Comment deleted successfully"

                } else {
                    throw new Error("Something went wrong")
                }
            } catch (error) {
                console.log("error", error)
                throw new Error(error)
            }
        }
    }
}