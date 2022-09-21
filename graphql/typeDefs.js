const {gql} = require("apollo-server")


module.exports = gql`
  type Post {
    id: ID!
    description: String!
    username: String!
    createdAt: String!
    comments: [Comment]!
    likes: [Like]!
    file: String
  }

  scalar Upload

  type Comment {
    id: ID
    username: String
    comment: String
    createdAt: String
  }

  type Like {
    id: ID!
    username: String!
    createdAt: String!
  }
  input RegisterUserInput {
    firstName: String!
    lastName: String!
    userName: String!
    email: String!
    password: String!
    confirmPassword: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input ChangePasswordInput {
    oldPassword: String!
    newPassword: String!
    confirmPassword: String!
  }


  type User {
    id: ID!
    firstName: String!
    lastName: String!
    userName: String!
    email: String!
    createdAt: String
  }

  type LoginType {
    token: String!
    expiryTime: String!
  }

  type Query {
    getPosts: [Post]
    getPostById(postId: ID!): Post!
    getUserById(userId: ID!): User!
  }

  type Mutation {
    registerUser(registerUserInput: RegisterUserInput): User!
    loginUser(loginInput: LoginInput): LoginType!
    createPost(description: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: ID!, comment: String!): Comment!
    editComment(postId: ID!, commentId: ID!, comment: String!): Comment!
    deleteComment(postId: ID!, commentId: ID!): String!
    likeandDislikePost(postId: ID!): String!
    changePassword(changePasswordInput: ChangePasswordInput): String!
  }
`;