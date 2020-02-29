const mongoose = require("mongoose");
const shortid = require("shortid");

const newHash = shortid.generate();

const publicUrlSchema = new mongoose.Schema({
  originalURL: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true,
    default: newHash
  },
  shortURL: {
    type: String,
    required: true,
    default: `${process.env.BASE_URL}/${newHash}`
  }
});

module.exports = mongoose.model("public-url", publicUrlSchema);
