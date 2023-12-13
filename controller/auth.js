const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

exports.signup = (req, res, next) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 422;
    error.messages = errors.array()
    throw error;
  }

  bcrypt.hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
        name: name,
      });
      user.save().then((result) => {
        res
          .status(201)
          .json({
            message: "User is successfully created in the Database!",
            userId: result._id,
          });
      }).catch((error) => {
        if (!error.statusCode) {
          error.statusCode = 500;
        }
        next(error);
      });;
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};
