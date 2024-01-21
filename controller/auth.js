const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 422;
    error.messages = errors.array();
    throw error;
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
        name: name,
      });
      user
        .save()
        .then((result) => {
          res.status(201).json({
            message: "User is successfully created in the Database!",
            userId: result._id,
          });
        })
        .catch((error) => {
          if (!error.statusCode) {
            error.statusCode = 500;
          }
          next(error);
        });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

exports.signin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("User with this email could not be found !");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Password is Wrong!");
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        { email: loadedUser.email, userId: loadedUser._id.toString() },
        "somesupersecret",
        { expiresIn: "1m" }
      );

      res.status(200).json({
        message: "your token is created and you are signed-in !",
        token: token,
        userId: loadedUser._id.toString(),
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


exports.resetPassword = async ( req, res, next)=>{
  const email = req.body.email 
  const errors = validationResult(req)

  try{
  const user = await User.findOne({email : email})

  if(!user){
    const error = new Error('Please Enter Correct Email')
    error.statusCode = 422
    throw error
  }

  if(!errors.isEmpty()){
    const error = new Error(errors.array()[0].msg)
    error.statusCode = 422
    throw error
  }
  res.json({
    message :' the endpoint is totally working fine ',
    email : email
  })
}
catch(error){
  if(!error.statusCode){
    error.statusCode = 500
  }
  next(error)
}
}