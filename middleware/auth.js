const { AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
require("dotenv").config();


module.exports = (context) => {
  const authHeader = context.req.headers.authorization;
  if (!authHeader) throw new AuthenticationError("Authentication token is required");
  const token = authHeader.split("Bearer ")[1]
  if (!token) throw new AuthenticationError("Authentication token must be provided");
  try {
    const user = jwt.verify(token, process.env.SECRET_KEY)
    return user;
  } catch (error) {
    console.log("error", error)
    throw new AuthenticationError("Invalid/Expired Auth token");
  }
};
