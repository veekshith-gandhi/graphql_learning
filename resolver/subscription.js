const dataBase = require("../static/dataBase");

const Subscription = {
  comment: {
    subscribe: (parent, { postId }, { pubsub, dataBase }, info) => {
      const postExist = dataBase.postData.filter(
        (post) => post.id === postId && post.published
      );

      if (!postExist) throw new Error("post not exist");

      return pubsub.asyncIterator(`comment ${postId}`);
    },
  },
  post: {
    subscribe: (parent, args, { pubsub }, info) => {
      return pubsub.asyncIterator(`post`);
    },
  },
};

module.exports = Subscription;
