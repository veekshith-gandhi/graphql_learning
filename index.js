const { createServer } = require("@graphql-yoga/node");
const { PubSub } = require("graphql-subscriptions");

const dataBase = require("./static/dataBase");
const Subscription = require("./resolver/subscription");
const Query = require("./resolver/query");
const Mutation = require("./resolver/mutation");
const Post = require("./resolver/post");
const User = require("./resolver/user");
const Comment = require("./resolver/comment");
const path = require("path");
const fs = require("fs");

//SUBSCRIPTION PASSING IN CTX
const pubsub = new PubSub();

// SCHEMA
const server = createServer({
  schema: {
    typeDefs: fs.readFileSync(
      path.join(__dirname, "/schema/schema.graphql"),
      "utf8"
    ),
    resolvers: {
      Query,
      Mutation,
      Subscription,
      Post,
      User,
      Comment,
    },
  },
  context: {
    dataBase,
    pubsub,
  },
});

//SERVER STARTING
server.start(() => {
  console.log("server is up");
});
