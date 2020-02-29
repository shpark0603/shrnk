const mongoose = require("mongoose");
const shortid = require("shortid");

const newHash = shortid.generate();

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
      default: newHash
    },
    shortURL: {
      type: String,
      required: true,
      default: `${process.env.BASE_URL}/${newHash}`
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
