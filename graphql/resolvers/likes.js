const Post = require("../../models/Post.model");
const User = require("../../models/User.model");
const authMiddleware = require("./../../middleware/auth");
module.exports = {
  Mutation: {
    likeandDislikePost: async (_, { postId }, context) => {
      try {
        const user = authMiddleware(context);
        const userDetails = await User.findById(user.userId);
        const post = await Post.findById(postId);
        if (!post) throw new Error("Post not found");
        const isAlreadyLiked = post.likes.find(
          (e) => e.username === userDetails.userName
        );
        if (isAlreadyLiked) {
          post.likes = post.likes.filter(
            (e) => e.username !== userDetails.userName
          );
          await post.save();
          return "Post disliked successfully";
        } else {
          post.likes.unshift({
            username: userDetails.userName,
            createdAt: new Date().toISOString(),
          });

          await post.save();
          return "Post liked successfully";
        }
      } catch (error) {
        console.log("error", error);
        throw new Error(error);
      }
    },
  },
};
