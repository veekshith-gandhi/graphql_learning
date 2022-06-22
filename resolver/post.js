const Post = {
  author: (parent, args, { dataBase }, info) => {
    return dataBase.userData.find((user) => {
      return user.id === parent.author;
    });
  },
  comment: (parent, args, { dataBase }, info) => {
    return dataBase.commentData.filter((comment) => {
      // console.log(com, parent);
      return comment.post === parent.id;
    });
  },
};

module.exports = Post;
