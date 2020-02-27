const shortid = require("shortid");

const ShrunkUrl = require("../models/shrunk.model");

exports.shrink = async (req, res) => {
  const { originalURL } = req.body;
  const urlID = shortid("original");
  const shrunkURL = `${process.env.BASE_URL}${process.env.PORT}/${urlID}`;

  const newURL = {
    originalURL,
    urlID
  };

  await ShrunkUrl.create(newURL);

  res.json({ message: "shunk it!", ...newURL });
};
