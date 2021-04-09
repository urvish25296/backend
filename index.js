//DEPENDENCIES
const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const { gql } = require("apollo-server");
const { SECRET_KEY } = require("./config");

//MODULES
const { MONGODB } = require("./config");
const typeDefs = require("./graphql/typeDefs.js");
const resolvers = require("./graphql/resolvers");

const User = require("./model/User");
const jwt = require("jsonwebtoken");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const bearer = req.headers.authorization || null;
    if (!bearer) return { user: null };

    try {
      var token = bearer.split(" ")[1];
    } catch (ex) {
      return { user: null };
    }

    try {
      var { id } = jwt.verify(token, SECRET_KEY);
    } catch (err) {
      return { user: null };
    }

    const user = await User.findOne({ _id: id });

    return { user };
  },
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log("MONGODB Connected");
    return server.listen({ port: 5000 });
  })
  .then((res) => {
    console.log(`Server Starts on ${res.url}`);
  })
  .catch((err) => {
    console.log(err);
  });
