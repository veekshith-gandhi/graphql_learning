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
    // console.log(postData);
    // console.log(commentData);
    // console.log(deletdUser);
    return deletdUser[0];
  },
  createPost: (parent, args, { dataBase }, info) => {
    const userExist = dataBase.userData.some((user) => {
      return user.id === args.data.author;
    });
    if (!userExist) throw new Error("user not exist");
    const post = {
      id: idGenerator(),
      ...args.data,
    };
    dataBase.postData.push(post);
    return post;
  },

  deletePost: (parent, args, { dataBase }, info) => {
    const idExist = dataBase.postData.find((post) => post.id === args.id);
    if (!idExist) throw new Error("post Id not existed");

    dataBase.postData = dataBase.postData.filter((post) => post.id !== args.id);
    dataBase.commentData = dataBase.commentData.filter(
      (comment) => comment.post !== args.id
    );
    // console.log(postData);
    // console.log(commentData);
    return idExist;
  },

  createComment: (parent, args, { dataBase }, info) => {
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
    dataBase.commentData.push(comment);
    // console.log(commentArray);
    return comment;
  },
  deleteComment: (parent, args, { dataBase }, info) => {
    const commentExist = dataBase.commentData.find(
      (comment) => comment.id == args.id
    );
    if (!commentExist) throw new Error("Comment dose not exist");

    dataBase.commentData = dataBase.commentData.filter(
      (comment) => comment.id !== args.id
    );

    return commentExist;
  },
};

module.exports = Mutation;
