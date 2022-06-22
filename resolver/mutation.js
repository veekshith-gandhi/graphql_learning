const idGenerator = require("../helper/randomId");

//Sclaer-Type => String,Boolean,ID,Float,Int
//Scaler-type which stores single value
//user: [User!]!  {custom type non scaler}

//ONE USER WILL HAVE MULTIPLE POSTS SO FILTER
//ONE POST WILL HAVE UNIQUE ID AND MULTIPLE USER MIGHT HAVE SO FIND

const Mutation = {
  createUser: (parent, args, { dataBase }, info) => {
    const emailExist = dataBase.userData.some(
      (user) => user.email === args.data.email
    );
    if (emailExist) {
      throw new Error("email alredy existed");
    }
    const user = {
      id: idGenerator(),
      ...args.data,
    };
    dataBase.userData.push(user);
    return user;
  },

  deleteUser: (parent, args, { dataBase }, info) => {
    //GET THE ID TO DELET AND RETURN ITS INDEX VALUYE
    const userIndex = dataBase.userData.findIndex(
      (user) => user.id === args.id
    );
    //IF NO USER RETURNED INDEX VALUE WILL BE -1
    if (userIndex == -1) throw new Error("user not existed");
    // IF USER EXIST THEN CONTINUE DELETING TBHE USER BY INDEX
    //SPLICING SINGLE ELEMNT
    const deletdUser = dataBase.userData.splice(userIndex, 1);
    //AFTER DELETINGH USER , NO POINT IN KEEPING USER POST
    //FILTER THE POST AND COMMENT USING AUTHOR ID
    //  WHEN USER DELETED HIS POST HAS TO DELT COMMENT ON MULTIPLE POST HAS TO

    dataBase.postData = dataBase.postData.filter((post) => {
      if (post.author == args.id) {
        dataBase.commentData = dataBase.commentData.filter(
          (comment) => comment.post !== post.id
        );
      }
      return post.author !== args.id;
    });
    dataBase.commentData = dataBase.commentData.filter(
      (comment) => comment.author !== args.id
    );
    return deletdUser[0];
  },
  updateUser: (parent, { id, data }, { dataBase }, info) => {
    const { userData } = dataBase;

    //CHECKING FOR USER
    const userExist = userData.find((user) => user.id === id);
    if (!userExist) throw new Error("User not found");

    if (typeof data.name == "string") {
      userExist.name = data.name;
    }
    //CHECKING FOR DUPLICATE EMAIL
    if (typeof data.email === "string") {
      const emailExist = userData.find((user) => user.email === data.email);

      if (emailExist) throw new Error("Email taken");
      //UPDATING EMAIL
      userExist.email = data.email;
    }

    if (data.age) {
      userExist.age = data.age;
    }
    return userExist;
  },
  createPost: (parent, args, { pubsub, dataBase }, info) => {
    const userExist = dataBase.userData.some((user) => {
      return user.id === args.data.author;
    });
    if (!userExist) throw new Error("user not exist");
    const post = {
      id: idGenerator(),
      ...args.data,
    };
    dataBase.postData.push(post);

    //SUBSCRIPTIOn
    if (args.data.published) {
      pubsub.publish("post", {
        post: {
          mutation: "CREATED",
          data: post,
        },
      });
    }
    return post;
  },

  deletePost: (parent, args, { dataBase, pubsub }, info) => {
    const idExist = dataBase.postData.find((post) => post.id === args.id);
    if (!idExist) throw new Error("post Id not existed");

    dataBase.postData = dataBase.postData.filter((post) => post.id !== args.id);
    dataBase.commentData = dataBase.commentData.filter(
      (comment) => comment.post !== args.id
    );

    if (idExist.published) {
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: idExist,
        },
      });
    }
    return idExist;
  },

  updatePost: (parent, { id, data }, { dataBase, pubsub }, info) => {
    const { postData } = dataBase;
    //CHECKING FOR USER
    const postExist = postData.find((post) => post.id === id);
    if (!postExist) throw new Error("post not found");

    const originalPost = { ...postExist };

    if (typeof data.title === "string") {
      postExist.title = data.title;
    }

    if (typeof data.body === "string") {
      postExist.body = data.body;
    }

    //CONDITION
    if (typeof data.published === "boolean") {
      postExist.published = data.published;
      if (originalPost.published && !data.published) {
        pubsub.publish("post", {
          post: {
            mutation: "DELETED",
            data: originalPost,
          },
        });
      } else if (!originalPost.published && data.published) {
        pubsub.publish("post", {
          post: {
            mutation: "CREATED",
            data: postExist,
          },
        });
      }
    } else if (postExist.published) {
      pubsub.publish("post", {
        post: {
          mutation: "UPDATED",
          data: postExist,
        },
      });
    }

    return postExist;
  },

  createComment: (parent, args, { dataBase, pubsub }, info) => {
    const userExist = dataBase.userData.some((user) => {
      return user.id === args.data.author;
    });

    const postExist = dataBase.postData.some((post) => {
      return post.id === args.data.post;
    });

    if (!postExist || !userExist) {
      throw new Error("post or user not existed");
    }
    const comment = {
      id: idGenerator(),
      ...args.data,
    };
    console.log(args);
    dataBase.commentData.push(comment);
    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: "CREATED",
        data: comment,
      },
    });
    return comment;
  },
  deleteComment: (parent, args, { dataBase, pubsub }, info) => {
    console.log(args);
    const commentExist = dataBase.commentData.find(
      (comment) => comment.id == args.id
    );
    if (!commentExist) throw new Error("Comment dose not exist");

    dataBase.commentData = dataBase.commentData.filter(
      (comment) => comment.id !== args.id
    );

    pubsub.publish(`comment ${commentExist.post}`, {
      comment: {
        mutation: "DELETED",
        data: commentExist,
      },
    });

    return commentExist;
  },
  updateComment: (parent, { id, data }, { dataBase, pubsub }, info) => {
    const { commentData } = dataBase;
    //CHECKING FOR USER
    const commentExist = commentData.find((comment) => comment.id === id);
    if (!commentExist) throw new Error("comment not found");

    if (typeof data.text === "string") {
      commentExist.text = data.text;
      pubsub.publish(`comment ${commentExist.post}`, {
        comment: {
          mutation: "UPDATED",
          data: commentExist,
        },
      });
    }
    return commentExist;
  },
};

module.exports = Mutation;
