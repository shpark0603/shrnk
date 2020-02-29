const User = require("../models/User.model");

const { validationResult } = require("express-validator");
const generateErrMsg = require("../utils/generateErrMsg");

exports.signup = async (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return next({
      code: 400,
      message: generateErrMsg(result)
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

  // TODO encrypt user password
  // TODO exclude user password
  res.json(user.toObject({ getters: true }));
};

exports.getUrlsByUserId = async (req, res, next) => {
  const { userId } = req.params;

  let userWithUrls;
  try {
    userWithUrls = await User.findById(userId).populate("urls");
  } catch (error) {
    return next({ code: 500 });
  }

  if (!userWithUrls || !userWithUrls.urls.length === 0) {
    console.log(userWithUrls);
    console.log(userWithUrls.urls);

    return next({
      code: 404,
      message: "Cannot find any shortened url by user id"
    });
  }

  res.json({
    urls: userWithUrls.urls.map(url => url.toObject({ getters: true }))
  });
};
