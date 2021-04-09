const bcrypt = require("bcryptjs");
const User = require("../../model/User");
const { UserInputError } = require("apollo-server");
const { SECRET_KEY } = require("../../config");
const {
  validateUserInput,
  validateLoginInput,
} = require("../../utill/validation");
const jwt = require("jsonwebtoken");

module.exports = {
  Query: {
    async getUsers(
      _,
      {
        userInput: {
          id,
          first_name,
          last_name,
          email,
          password,
          phone_number,
          is_admin,
          status,
        },
      },
      context
    ) {
      const detail = {
        _id: id,
        first_name,
        last_name,
        email,
        password,
        phone_number,
        is_admin,
        status,
      };
      Object.keys(detail).forEach((key) =>
        detail[key] === undefined ? delete detail[key] : {}
      );

      if (!context.user || !context.user.is_admin)
        return {
          obj: [],
          message: "Unathorized to list Users.",
          error: true,
        };

      const users = await User.find(detail);
      return {
        obj: users,
        message: "Fetched users",
        error: false,
      };
    },
  },

  Mutation: {
    async createUser(
      _,
      {
        userInput: {
          first_name,
          last_name,
          email,
          password,
          phone_number,
          is_admin,
          status,
        },
      },
      context
    ) {
      password = await bcrypt.hash(password, 12);
      const detail = {
        first_name,
        last_name,
        email,
        password,
        phone_number,
        is_admin,
        status,
      };
      Object.keys(detail).forEach((key) =>
        detail[key] === undefined ? delete detail[key] : {}
      );

      if (!context.user || !context.user.is_admin)
        return {
          obj: [],
          message: "Unathorized to create Users.",
          error: true,
        };

      try {
        const user = await User.findOne({ email });
        if (user) throw new UserInputError("This email is taken");

        const { valid, errors } = validateUserInput(
          first_name,
          last_name,
          email,
          password,
          phone_number,
          is_admin,
          status
        );
        if (!valid) {
          throw new UserInputError("Errors", { errors });
        }
      } catch (ex) {
        return {
          obj: [],
          message: "An error occurred.", // TODO: Better message collection
          error: true,
          token: "",
        };
      }

      const user = await new User(detail).save();
      return {
        obj: [user],
        message: "User created successfully.",
        error: false,
        token: "",
      };
    },

    async updateUser(
      _,
      {
        userInput: {
          id,
          first_name,
          last_name,
          email,
          password,
          phone_number,
          is_admin,
          status,
        },
      },
      context
    ) {
      if (password == "") password = undefined;
      if (password) password = await bcrypt.hash(password, 12);
      const detail = {
        first_name,
        last_name,
        email,
        password,
        phone_number,
        is_admin,
        status,
      };
      Object.keys(detail).forEach((key) =>
        detail[key] === undefined ? delete detail[key] : {}
      );

      if (!context.user || !context.user.is_admin)
        return {
          obj: [],
          message: "Unathorized to update Users.",
          error: true,
        };

      const user = await User.findOneAndUpdate({ _id: id }, detail);

      if (!user) {
        return {
          obj: [],
          message: "User could not be updated.",
          error: true,
          token: "",
        };
      }
      return {
        obj: [user],
        message: "User updated.",
        error: false,
        token: "",
      };
    },

    async deleteUser(
      _,
      {
        userInput: {
          id,
          first_name,
          last_name,
          email,
          password,
          phone_number,
          is_admin,
          status,
        },
      },
      context
    ) {
      if (!context.user || !context.user.is_admin)
        return {
          obj: [],
          message: "Unathorized to delete Users.",
          error: true,
        };

      const user = await User.deleteOne({ _id: id });

      if (user.deletedCount < 1) {
        return {
          obj: [],
          message: "User could not be deleted.",
          error: true,
        };
      }

      return {
        obj: [],
        message: "User deleted.",
        error: false,
      };
    },

    async getToken(_, { email, password }) {
      try {
        const { errors, valid } = validateLoginInput(email, password);

        if (!valid) {
          throw new UserInputError("Invalid Input", { errors });
        }

        var user = await User.findOne({ email });

        if (!user) {
          errors.general = "User not found";
          throw new UserInputError("User not found", { errors });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          errors.general = "Wrong crendetials";
          throw new UserInputError("Wrong crendetials", { errors });
        }
      } catch (ex) {
        return {
          message: "Invalid username or password.", // generic message for safety
          error: true,
        };
      }

      const token = jwt.sign(
        {
          id: user.id,
        },
        SECRET_KEY,
        { expiresIn: 86400 }
      );

      return {
        user,
        message: "Token generated.",
        error: false,
        token,
      };
    },
  },
};
