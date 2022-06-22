const { createServer } = require("@graphql-yoga/node");
const dataBase = require("./static/dataBase");
const Query = require("./resolver/query");
const Mutation = require("./resolver/mutation");
const Post = require("./resolver/post");
const User = require("./resolver/user");
const Comment = require("./resolver/comment");
const path = require("path");

// SCHEMA
const server = createServer({
  schema: {
    typeDefs: `${path.join(__dirname, "schema/schema.graphql")}`,

    resolvers: {
      Query,
      Mutation,
      Post,
      User,
      Comment,
    },
  },
  context: {
    dataBase,
  },
});

server.start(() => {
  console.log("server is up");
});
