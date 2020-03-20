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

  try {
    const url = await PublicUrl.findOne({ originalURL });
    if (url) {
      return res.json(url.toObject({ getters: true }));
    }
  } catch (error) {
    return next({ code: 500 });
  }

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
      return next({ code: 400, message: "Invalid user id" });
    }
  } catch (error) {
    return next({ code: 500 });
  }

  try {
    const isUrlExisting = await Url.findOne({ originalURL, creator: userId });
    if (isUrlExisting) {
      return next({
        code: 400,
        message: "Shrunk url for this long url already existing"
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
      return next({ code: 404, message: "Shortened Url not found" });
    }

    if (url.creator.id !== userId) {
      return next({ code: 403, message: "Unauthorized" });
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

  res.json({ message: "Shortened url deleted" });
};

exports.updateName = async (req, res, next) => {
  const { name } = req.body;
  const { userId } = req.user;
  const { urlId } = req.params;

  try {
    const url = await Url.findById(urlId).populate("creator");

    if (!url) {
      return next({ code: 404, message: "Shortened url not found" });
    }

    if (url.creator.id !== userId) {
      return next({ code: 403, message: "Unauthorized" });
    }

    url.name = name;
    await url.save();
  } catch (error) {
    return next({ code: 500 });
  }

  res.json({ message: "Shortened url name updated" });
};
