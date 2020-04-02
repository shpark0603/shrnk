const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const User = require("../models/User.model");

const generateErrMsg = require("../utils/generateErrMsg");
const transform = require("../utils/userDocTransform");

exports.signup = async (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return next({
      code: 400,
      message: generateErrMsg(result)
    });
  }

  const { name, email, password } = req.body;

  try {
    const isEmailExisting = await User.findOne({ email });

    if (isEmailExisting) {
      return next({
        code: 400,
        message: "이미 존재하는 이메일입니다."
      });
    }
  } catch (error) {
    return next({ code: 500 });
  }

  const newUser = new User({ name, email, urls: [] });

  try {
    await newUser.setPassword(password);
    await newUser.save();
  } catch (error) {
    return next({ code: 500 });
  }

  const token = newUser.generateToken();
  res.cookie("access_token", `Bearer ${token}`, {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  });

  res.status(201).json(newUser.toObject({ getters: true, transform }));
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  let user;
  try {
    user = await User.findOne({ email });

    if (!user) {
      return next({
        code: 400,
        message: "이메일 또는 비밀번호가 일치하지 않습니다."
      });
    }

    const isValidPassword = await user.isValid(password);
    if (!isValidPassword) {
      return next({
        code: 400,
        message: "이메일 또는 비밀번호가 일치하지 않습니다."
      });
    }
  } catch (error) {
    return next({ code: 500 });
  }

  const token = user.generateToken();
  res.cookie("access_token", `Bearer ${token}`, {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  });

  res.json(user.toObject({ getters: true, transform }));
};

exports.getUrlsByUserId = async (req, res, next) => {
  const { userId } = req.params;

  let userWithUrls;
  try {
    userWithUrls = await User.findById(userId).populate({
      path: "urls",
      options: { sort: { createdAt: "descending" } }
    });
    if (!userWithUrls || !userWithUrls.urls.length === 0) {
      return next({
        code: 404,
        message: "올바르지 않은 접근입니다. 다시 시도해주세요."
      });
    }
  } catch (error) {
    return next({ code: 500 });
  }

  res.json(userWithUrls.urls.map(url => url.toObject({ getters: true })));
};

exports.logout = async (req, res, next) => {
  res.cookie("access_token");

  res.json({ message: "Logged out" });
};

exports.deleteAccount = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  const { userId } = req.params;

  if (userId !== req.user.userId) {
    return next({ code: 403, message: "권한이 없습니다." });
  }

  if (password !== confirmPassword) {
    return next({
      code: 400,
      message: "패스워드가 일치하지 않습니다."
    });
  }

  try {
    const user = await User.findById(req.user.userId).populate("urls");

    if (!user) {
      return next({ code: 400, message: "Invalid credentials" });
    }

    if (email !== user.email) {
      return next({ code: 400, message: "Invalid credentials" });
    }

    const isValidPassword = await user.isValid(password);

    if (!isValidPassword) {
      return next({ code: 400, message: "Invalid credentials" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    await user.urls.forEach(url => url.remove({ session }));
    await user.remove({ session });
    session.commitTransaction();
  } catch (error) {
    console.log(error);
    return next({ code: 500 });
  }

  res.json({ message: "회원탈퇴가 완료되었습니다." });
};

exports.checkAuth = (req, res, next) => {
  const { user } = req;

  if (!user) {
    res.cookie("access_token");
    return { code: 401, message: "인증 실패" };
  }

  res.json({ message: "인증 성공" });
};
