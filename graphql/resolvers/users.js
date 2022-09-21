const User = require("../../models/User.model");
const bcrypt = require("bcryptjs");
const validateUserEmail = require("../../utils/validators");
const { UserInputError, AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../../middleware/auth");
require("dotenv").config();
module.exports = {
  Mutation: {
    registerUser: async (parent, { registerUserInput }) => {
      try {
        const {
          firstName,
          lastName,
          userName,
          email,
          password,
          confirmPassword,
        } = registerUserInput;

        // Validate Email
        console.log("Hello register");
        const { errors } = validateUserEmail(email);
        if (Object.keys(errors).length) {
          throw new UserInputError(errors.email);
        }

        // Check if user exists with same username or email
        const userExists = await User.findOne({
          $or: [{ email }, { userName }],
        });
        if (userExists) {
          throw new Error("User with this email or username already exists");
        }

        if (password !== confirmPassword) {
          throw new Error("password and confirm password should be same");
        }

        const hasedPassword = await bcrypt.hash(password, 10);
        const user = new User({
          firstName,
          lastName,
          userName,
          email,
          password: hasedPassword,
          createdAt: new Date().toISOString(),
        });

        await user.save();
        return user;
      } catch (error) {
        console.log("error", error);
        throw new Error(error);
      }
    },

    loginUser: async (_, { loginInput }) => {
      try {
        const { email, password } = loginInput;

        //Validate User email

        const { errors } = validateUserEmail(email);
        if (Object.keys(errors).length) {
          throw new UserInputError(errors.email);
        }

        const user = await User.findOne({ email: email });
        if (!user) throw new Error("User does not exists");
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw new Error("Invalid credentials");

        const token = jwt.sign(
          {
            userId: user.id,
            email: user.email,
          },
          process.env.SECRET_KEY,
          { expiresIn: "1h" }
        );
        return { userId: user.id, token, tokenExpiration: 1 };
      } catch (error) {
        throw new Error(error);
      }
    },

    changePassword: async (_, { changePasswordInput }, context) => {
      try {
        const { oldPassword, newPassword, confirmPassword } =
          changePasswordInput;
        const user = authMiddleware(context);
        const loggedinUser = await User.findById(user.userId);
        console.log("Loggedin user", loggedinUser);
        const valid = await bcrypt.compare(oldPassword, loggedinUser.password);
        if (!valid) throw new AuthenticationError("Invalid old password");
        if (newPassword === confirmPassword) {
          const saltRounds = 10;
          loggedinUser.password = await bcrypt.hash(newPassword, saltRounds);
          await loggedinUser.save();
          return "Your password has been changes successfully";
        } else {
          throw new Error(
            "Your new password and confirm password does not match"
          );
        }
      } catch (error) {
        console.log("error", error);
        throw new Error(error);
      }
    },
  },

  Query: {
    getUserById: async (_, { userId }, context) => {
      try {
        authMiddleware(context);
        const user = await User.findById(userId);
        if (!user) throw new Error("User with this id not found");
        return user;
      } catch (error) {
        console.log("error", error);
        throw new Error(error);
      }
    },
  },
};
