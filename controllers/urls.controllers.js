const mongoose = require("mongoose");

const Url = require("../models/Url.model");
const User = require("../models/User.model");

exports.shrink = async (req, res, next) => {
  const { originalURL, userId } = req.body;

  let user;

  try {
    user = await User.findById(userId);
  } catch (error) {
    if (error.message.startsWith("Cast to ObjectId")) {
      return next({ code: 400, message: "Not a valid user id" });
    }

    return next({ code: 500 });
  }

  if (!user) {
    return next({ code: 400, message: "Not a valid user id" });
  }

  let isUrlExisting;
  try {
    isUrlExisting = await Url.findOne({ originalURL, userId: user.id });
  } catch (error) {
    return next({ code: 500 });
  }

  if (isUrlExisting) {
    return next({
      code: 400,
      message: "Shrunk url for this long url already existing"
    });
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

  let url;
  try {
    url = await Url.findById(urlId).populate("creator");
  } catch (error) {
    console.log(error);
    return next({ code: 500 });
  }

  if (!url) {
    return next({ code: 404, message: "Shortened Url not found" });
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    await url.remove({ session });
    await url.creator.urls.pull(url);
    await url.creator.save({ session });

    await session.commitTransaction();
  } catch (error) {
    console.log(error);
    return next({ code: 500 });
  }

  res.json({ message: "Successfully deleted shortened url." });
};

// TODO: setUrlName
