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
    hash: {
      type: String,
      required: true,
      default: shortid.generate
    },
    creator: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "user"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("url", urlSchema);
