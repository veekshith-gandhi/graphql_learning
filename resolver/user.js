const User = {
  post: (parent, args, { dataBase }, info) => {
    return dataBase.postData.filter((post) => {
      return post.author === parent.id;
    });
  },
  comment: (parent, args, { dataBase }, info) => {
    return dataBase.commentData.filter((comment) => {
      return comment.author === parent.id;
    });
  },
};

module.exports = User;
