const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  originalURL: {
    type: String,
    required: true
  },
  urlID: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Url", urlSchema);
