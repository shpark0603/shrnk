const User = require("../models/User.model");

const { validationResult } = require("express-validator");

const { getSignupErrMsg } = require("../utils/errMsgCreators");

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next({
      code: 400,
      message: `Invalid ${getSignupErrMsg(errors)}, please try again`
    });
  }

  const { name, email, password } = req.body;

  let isEmailExisting;

  try {
    isEmailExisting = await User.findOne({ email });
  } catch (error) {
    return next({ code: 500 });
  }

  if (isEmailExisting) {
    return next({ code: 400, message: "Cannot use this email" });
  }

  const newUser = new User({ name, email, password, urls: [] });

  try {
    await newUser.save();
  } catch (error) {
    return next({ code: 500 });
  }

  res.status(201).json({ user: newUser.toObject({ getters: true }) });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  let user;
  try {
    user = await User.findOne({ email });
  } catch (error) {
    return next({ code: 500 });
  }

  if (!user || user.password !== password) {
    return next({ code: 400, message: "Invalid credentials" });
  }

  res.json({ message: "Successfully logged in" });
};
