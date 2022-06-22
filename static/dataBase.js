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

const dataBase = {
  postData,
  userData,
  commentData,
};

module.exports = dataBase;
