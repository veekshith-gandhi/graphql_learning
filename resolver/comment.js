const Comment = {
  author: (parent, args, { dataBase }, info) => {
    return dataBase.userData.find((user) => {
      return user.id === parent.author;
    });
  },
  post: (parent, args, { dataBase }, info) => {
    return dataBase.postData.find((post) => {
      return post.id === parent.post;
    });
  },
};

module.exports = Comment;
