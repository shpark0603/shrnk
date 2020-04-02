const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const generateErrMsg = require("../utils/generateErrMsg");
const normalizeURL = require("../utils/normalizeURL");

const PublicUrl = require("../models/PublicUrl.model");
const Url = require("../models/Url.model");
const User = require("../models/User.model");

exports.publicShrink = async (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return next({ code: 400, message: generateErrMsg(result) });
  }

  let { originalURL } = req.body;

  originalURL = normalizeURL(originalURL);

  const newURL = new PublicUrl({ originalURL });

  try {
    await newURL.save();
  } catch (error) {
    return next({ code: 500 });
  }

  res.json(newURL.toObject({ getters: true }));
};

exports.shrink = async (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return next({ code: 404, message: generateErrMsg(result) });
  }

  let { originalURL } = req.body;

  originalURL = normalizeURL(originalURL);

  const { userId } = req.user;

  let user;
  try {
    user = await User.findById(userId);
    if (!user) {
      return next({
        code: 400,
        message: "올바르지 않은 접근입니다. 다시 시도해주세요."
      });
    }
  } catch (error) {
    return next({ code: 500 });
  }

  try {
    const isUrlExisting = await Url.findOne({ originalURL, creator: userId });
    if (isUrlExisting) {
      return next({
        code: 400,
        message: "올바르지 않은 접근입니다. 다시 시도해주세요."
      });
    }
  } catch (error) {
    return next({ code: 500 });
  }

  const newURL = new Url({ originalURL, creator: userId });

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    await newURL.save({ session });

    user.urls.push(newURL);
    await user.save({ session });

    session.commitTransaction();
  } catch (error) {
    return next({ code: 500 });
  }

  res.status(201).json({ newURL: newURL.toObject({ getters: true }) });
};

exports.delete = async (req, res, next) => {
  const { urlId } = req.params;
  const { userId } = req.user;

  let url;
  try {
    url = await Url.findById(urlId).populate("creator");
    if (!url) {
      return next({
        code: 404,
        message: "올바르지 않은 접근입니다. 다시 시도해주세요."
      });
    }

    if (url.creator.id !== userId) {
      return next({ code: 403, message: "권한이 없습니다." });
    }
  } catch (error) {
    return next({ code: 500 });
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    await url.remove({ session });
    await url.creator.urls.pull(url);
    await url.creator.save({ session });

    await session.commitTransaction();
  } catch (error) {
    return next({ code: 500 });
  }

  res.json({ message: "성공적으로 삭제되었습니다." });
};

exports.updateName = async (req, res, next) => {
  const { name } = req.body;
  const { userId } = req.user;
  const { urlId } = req.params;

  try {
    const url = await Url.findById(urlId).populate("creator");

    if (!url) {
      return next({
        code: 404,
        message: "올바르지 않은 접근입니다. 다시 시도해주세요."
      });
    }

    if (url.creator.id !== userId) {
      return next({ code: 403, message: "권한이 없습니다." });
    }

    url.name = name;
    await url.save();
  } catch (error) {
    return next({ code: 500 });
  }

  res.json({ message: "성공적으로 수정되었습니다." });
};

exports.batchShrink = async (req, res, next) => {
  const { userId } = req.user;
  const { hashes } = req.body;

  let user;
  try {
    user = await User.findById(userId);
    if (!user) {
      return next({ code: 400, message: "존재하지 않는 사용자입니다." });
    }
  } catch (error) {
    return next({ code: 500 });
  }

  const newURLs = hashes.map(
    hash =>
      new Url({
        originalURL: hash.originalURL,
        hash: hash.hash,
        creator: userId
      })
  );

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    await Url.insertMany(newURLs);

    user.urls.push(...newURLs);
    await user.save({ session });

    session.commitTransaction();
  } catch (error) {
    console.error(error);
    return next({ code: 500 });
  }

  res.status(201).json({
    newURLs: newURLs.map(newUrl => newUrl.toObject({ getters: true }))
  });
};
