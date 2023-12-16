const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

const Post = require("../models/post");
const User = require("../models/user");

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  // same value as given in the frontend, we can setup this in such way that it goes from the backend and then we do all but no worries right now hardcoding it putting the same value of 2 and we want on the frontend

  let totalItems;

  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      // here below we cannot not only find the items but also perform pagination
      return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((posts) => {
      if (!posts) {
        const error = new Error("Posts arent fetched from the DB");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        message: " all posts fetched successfully !!",
        posts: posts,
        totalItems: totalItems,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// now making the post request

exports.createPost = (req, res, next) => {
  // lets assume this will the post created in the Database.
  const errors = validationResult(req);
  const title = req.body.title;
  const content = req.body.content;
  let creator;

  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error("The image isnt added!");
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path;
  const imgObj = req.file;
  console.log(imgObj);

  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.userId,
  });
  post
    .save()
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      creator = user;
      user.posts.push(post);
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Post created Successfully",
        post: post,
        creator: { _id: creator._id, name: creator.name },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("the post isnt found");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        message: "post fetched successfully",
        post: post,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.editPost = (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;

  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error("no image is provided !");
    error.statusCode = 422;
    throw error;
  }
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("post isnt found in the database");
        error.statusCode = 404;
        throw error;
      }
      if (post.creator.toString() !== req.userId) {
        const error = new Error("Not Authorized!");
        error.statusCode = 403; // code for the authorization
        throw error;
      }
      if (imageUrl != post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      post.save().then((result) => {
        res
          .status(200)
          .json({ message: "post is updated successfully !", post: result });
      });
    })
    .catch((err) => {
      next(err);
    });
};

//creating a helper function now

const clearImage = (filepath) => {
  filepath = path.join(__dirname, "..", filepath);
  fs.unlink(filepath, (err) => {
    console.log(err);
  });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      // here we check the logged in user.
      if (!post) {
        const error = new Error("the post isnt found");
        error.statusCode = 404;
        throw error;
      }
      if (post.creator.toString() !== req.userId) {
        const error = new Error("Not Authorized!");
        error.statusCode = 403; // code for the authorization
        throw error;
      }

      clearImage(post.imageUrl);
      Post.findByIdAndDelete(postId)
      .then((result) => {
                return User.findById(req.userId)
      }).then((user)=>{
        user.posts.pull(postId)
        return user.save()
        
      }).then((result)=>{
        res.json({ message: "post is deleted! successfully !" });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
