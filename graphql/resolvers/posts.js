const Post = require("../../models/Post.model")
const {GraphQLUpload} = require("apollo-server")
const authMiddleware = require("../../middleware/auth")
const User = require("../../models/User.model")
const { AuthenticationError } = require("apollo-server")
const path = require("path")
const fs = require("fs")


module.exports = {
    Query: {
        getPosts : async (_, {}, context) => {
            try {
                authMiddleware(context)
                const posts = await Post.find({}).sort({createdAt: -1})
                return posts
            } catch (error) {
                throw new Error(error)
            }
        },

        getPostById: async(_, {postId}, context) => {
            try {
                authMiddleware(context)
                const post = await Post.findById(postId)
                if(!post) throw new Error("Post not found")
                return post
            } catch (error) {
                console.log("error", error)
                throw new Error(error)
            }
        } 
      },
      Upload: GraphQLUpload,

      Mutation: {
        createPost: async (_, {description}, context) => {
            const loggedinUser = authMiddleware(context)
            const loggedinUserDetails = await User.findById(loggedinUser.userId)
            try {
                // const {createReadStream, filename} = await file
                // const stream = createReadStream()
                // const pathName = path.join(__dirname, `../../assets/images/${filename}`)
                // await stream.pipe(fs.createWriteStream(pathName))
                const post = new Post({
                    description,
                    username: loggedinUserDetails.userName,
                    createdAt: new Date().toISOString(),
                    user: loggedinUser.userId,
                    // image: filename
                })
                await post.save()
                return post
            } catch (error) {
                console.log("error", error)
                throw new Error(error)
            }
        },
        deletePost: async(_, {postId}, context) => {
            try {
                const user = authMiddleware(context)
                const loggedinUserDetails = await User.findById(user.userId)
                const post = await Post.findById(postId)
                if(!post) throw new Error("Post of this Id not found")

                if(post.username === loggedinUserDetails.userName) {
                    await post.delete()
                    return "Post deleted successfully"
                } else {
                    throw new AuthenticationError("Action not allowed")
                }

            } catch (error) {
                console.log("error", error)
                throw new Error(error)
            }
        }
      }
}