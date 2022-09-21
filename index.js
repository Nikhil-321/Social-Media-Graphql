const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const graphqlUploadExpress = require("graphql-upload/graphqlUploadExpress.js");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers/resolver");

mongoose.connect(process.env.MONGO_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

console.log("Mongoose connected successfully");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  context: ({ req }) => ({ req }),
});

const corsOptions = {
  origin: ["http://localhost:3000", "https://studio.apollographql.com"]
}

const app = express();

server.start().then((res) => {
  server.applyMiddleware({ app, cors: corsOptions });
  // app.use(graphqlUploadExpress());
  // app.use(express.static("public"));
  app.listen({ port: 5000 }, () => {
    console.log("Server is running on port 5000");
  });
});
