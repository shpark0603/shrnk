const mongoose = require("mongoose");

const Url = require("../models/Url.model");
const User = require("../models/User.model");

exports.shrink = async (req, res, next) => {
  const { originalURL, creator } = req.body;

  let user;

  try {
    user = await User.findById(creator);
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
    isUrlExisting = await Url.findOne({ originalURL, creator: user.id });
  } catch (error) {
    return next({ code: 500 });
  }

  if (isUrlExisting) {
    return next({
      code: 400,
      message: "Shrunk url for this long url already existing"
    });
  }

  const newURL = new Url({ originalURL, creator });

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

// TODO: setUrlName
