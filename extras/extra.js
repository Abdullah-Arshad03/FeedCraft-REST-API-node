//pagination logic
 // pagination 
  // .countDocuments()
  // .then((count) => {
  //   totalItems = count;
  //   // here below we cannot not only find the items but also perform pagination
  //   return Post.find()
  //     .skip((currentPage - 1) * perPage)
  //     .limit(perPage);
  // })