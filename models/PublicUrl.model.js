const mongoose = require("mongoose");
const shortid = require("shortid");

const publicUrlSchema = new mongoose.Schema({
  originalURL: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true,
    default: shortid.generate
  }
});

module.exports = mongoose.model("public-url", publicUrlSchema);
