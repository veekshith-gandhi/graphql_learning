const { createServer } = require("@graphql-yoga/node");

const idGenerator = require("./helper/randomId");

//Sclaer-Type => String,Boolean,ID,Float,Int
//Scaler-type which stores single value
//user: [User!]!  {custom type non scaler}

//ONE USER WILL HAVE MULTIPLE POSTS SO FILTER
//ONE POST WILL HAVE UNIQUE ID AND MULTIPLE USER MIGHT HAVE SO FIND

const commentData = [
  {
    id: "101",
    text: "comment 1",
    author: "1",
    post: "11",
  },
  {
    id: "102",
    text: "comment 2",
    author: "2",
    post: "12",
  },
  {
    id: "103",
    text: "comment 3",
    author: "3",
    post: "13",
  },
  {
    id: "104",
    text: "comment 4",
    author: "3",
    post: "13",
  },
];
const userData = [
  { id: "1", name: "arjun", email: "arjun@", age: 23 },
  { id: "2", name: "bhaskar", email: "bhaskar@", age: 53 },
  { id: "3", name: "charu", email: "charu@", age: 13 },
];
const postData = [
  {
    id: "11",
    title: "scratch and win",
    body: "i'm the winner",
    published: true,
    author: "1",
  },
  {
    id: "12",
    title: "bob the builder",
    body: "i.m the looser",
    published: false,
    author: "1",
  },
  {
    id: "13",
    title: "hunting lion",
    body: "i'm the man",
    published: true,
    author: "2",
  },
];
// SCHEMA
const server = createServer({
  schema: {
    typeDefs: `
        type Query {
           post(query: Int): [Post!]!
           user(query: String): [User!]! 
           comment(query: Int) : [Comment!]!
           me: User!
        }
        type Mutation{
          createUser(data: CreateUserInput!): User!
          createPost(data: CreatePostInput!): Post!
          createComment(data: CreateCommentInput!): Comment!
        }
        input CreateUserInput{
          name: String!
          email: String!
          age:Int
        }
        input CreatePostInput{
           title: String!
           body: String!
           published: Boolean!
           author:ID!
        }
        input CreateCommentInput{
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
          comment:[ Comment!]!
        }

        type Comment {
          id:ID!
          text: String!
          author: User!
          post: Post!
        }
        `,
    resolvers: {
      Query: {
        user: (parent, args, ctx, info) => {
          if (!args.query) return userData;
          return userData.filter((i) =>
            i.name.toLowerCase().includes(args.query.toLowerCase())
          );
        },
        post: (parent, args, ctx, info) => {
          if (!args.query) return postData;
          return postData.filter((i) => i.id == args.query);
        },
        comment: (parent, args, ctx, info) => {
          if (!args.query) return commentData;
          return commentData.filter((i) => i.id == args.query);
        },
        me: () => {
          return {
            id: 1,
            name: "veekshith",
            email: "veekshith@gmail.com",
            age: 25,
          };
        },
      },
      Mutation: {
        createUser: (parent, args, ctx, info) => {
          const emailExist = userData.some(
            (user) => user.email === args.data.email
          );
          if (emailExist) {
            throw new Error("email alredy existed");
          }
          const user = {
            id: idGenerator(),
            ...args.data,
          };
          userData.push(user);
          return user;
        },
        createPost: (parent, args, ctx, info) => {
          const userExist = userData.some((user) => {
            return user.id === args.data.author;
          });
          if (!userExist) throw new Error("user not exist");
          const post = {
            id: idGenerator(),
            ...args.data,
          };
          postData.push(post);
          return post;
        },
        createComment: (parent, args, ctx, info) => {
          const userExist = userData.some((user) => {
            return user.id === args.data.author;
          });

          const postExist = postData.some((post) => {
            return post.id === args.data.post;
          });

          if (!postExist || !userExist) {
            throw new Error("post or user not existed");
          }
          const comment = {
            id: idGenerator(),
            ...args.data,
          };
          commentData.push(comment);
          // console.log(commentArray);
          return comment;
        },
      },
      Post: {
        author: (parent, args, ctx, info) => {
          return userData.find((user) => {
            return user.id === parent.author;
          });
        },
        comment: (parent, args, ctx, info) => {
          return commentData.filter((comment) => {
            // console.log(com, parent);
            return comment.post === parent.id;
          });
        },
      },
      User: {
        post: (parent, args, ctx, info) => {
          return postData.filter((post) => {
            return post.author === parent.id;
          });
        },
        comment: (parent, args, ctx, info) => {
          return commentData.filter((comment) => {
            return comment.author === parent.id;
          });
        },
      },
      Comment: {
        author: (parent, args, ctx, info) => {
          return userData.find((user) => {
            return user.id === parent.author;
          });
        },
        post: (parent, args, ctx, info) => {
          return postData.find((post) => {
            // console.log(post, parent);
            return post.id === parent.post;
          });
        },
      },
    },
  },
});

server.start(() => {
  console.log("server is up");
});
