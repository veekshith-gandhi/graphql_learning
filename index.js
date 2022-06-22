const { createServer, makeExecute } = require("@graphql-yoga/node");
const dataBase = require("./static/dataBase");
const Query = require("./resolver/query");
const Mutation = require("./resolver/mutation");
const Post = require("./resolver/post");
const User = require("./resolver/user");
const Comment = require("./resolver/comment");

// SCHEMA
const server = createServer({
  schema: {
    typeDefs: `
    type Query {
      post(query: Int): [Post!]!
      user(query: String): [User!]!
      comment(query: Int): [Comment!]!
      me: User!
    }
    type Mutation {
      createUser(data: CreateUserInput!): User!
      deleteUser(id: ID!): User!
      updateUser(id:ID!, data:updateUserInput!): User!
      createPost(data: CreatePostInput!): Post!
      deletePost(id: ID!): Post!
      updatePost(id:ID!, data:UpdatePostInput):Post!
      createComment(data: CreateCommentInput!): Comment!
      deleteComment(id: ID!): Comment!
      updateComment(id:ID!, data:UpdateCommentInput!):Comment!
    }
    input CreateUserInput {
      name: String!
      email: String!
      age: Int
    }
    input updateUserInput{
      name: String
      email: String
      age: Int
    }
    input CreatePostInput {
      title: String!
      body: String!
      published: Boolean!
      author: ID!
    }
    input UpdatePostInput{
      title: String
      body: String
      published: Boolean
    }
    input CreateCommentInput {
      text: String!
      author: ID!
      post: ID!
    }
    
    type User {
      id: ID!
      name: String!
      email: String!
      age: Int
      post: [Post!]!
      comment: [Comment!]!
    }
    
    type Post {
      id: ID!
      title: String!
      body: String!
      published: Boolean!
      author: User!
      comment: [Comment!]!
    }
    
    type Comment {
      id: ID!
      text: String!
      author: User!
      post: Post!
    }
    input UpdateCommentInput{
      text: String
    }
    
    `,
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

makeExecute;
server.start(() => {
  console.log("server is up");
});
