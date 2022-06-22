const Query = {
  user: (parent, args, { dataBase }, info) => {
    if (!args.query) return dataBase.userData;
    return dataBase.userData.filter((i) =>
      i.name.toLowerCase().includes(args.query.toLowerCase())
    );
  },
  post: (parent, args, { dataBase }, info) => {
    if (!args.query) return dataBase.postData;
    return dataBase.postData.filter((i) => i.id == args.query);
  },
  comment: (parent, args, { dataBase }, info) => {
    if (!args.query) return dataBase.commentData;
    return dataBase.commentData.filter((i) => i.id == args.query);
  },
  me: () => {
    return {
      id: 1,
      name: "veekshith",
      email: "veekshith@gmail.com",
      age: 25,
    };
  },
};

module.exports = Query;
