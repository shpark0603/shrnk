const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    name: {
      type: String,
      required: true
    },
    urls: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "url"
      }
    ]
  },
  { timestamps: true }
);

userSchema.methods.setPassword = async function(password) {
  const hashedPW = await bcrypt.hash(password, 12);
  this.password = hashedPW;
};

userSchema.methods.isValid = async function(password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function() {
  return jwt.sign({ id: this.id, email: this.email }, process.env.JWT_SALT, {
    expiresIn: "7d"
  });
};

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("user", userSchema);
