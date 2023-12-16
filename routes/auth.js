const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");
const { check } = require("express-validator");
const User = require("../models/user");

router.post(
  "/signup",
  [
    check("email", "Please Enter Valid Email!")
      .isEmail()
      .trim()
      .normalizeEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value })
          .then((userDoc) => {
            if (userDoc) {
              return Promise.reject("Email exists already in the database!");
            }
          })
      }),
    check("name", "Name must not be empty ").trim().notEmpty(),
    check("password", "password must contain atleast 5 characters")
      .trim()
      .isLength({ min: 5 }),
  ],
  authController.signup
);

router.post('/signin', authController.signin)



module.exports = router;
