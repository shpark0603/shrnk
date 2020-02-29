const mongoose = require("mongoose");
const shortid = require("shortid");

const urlSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    originalURL: {
      type: String,
      required: true
    },
    shortID: {
      type: String,
      default: shortid.generate
    },
    creator: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Url", urlSchema);
