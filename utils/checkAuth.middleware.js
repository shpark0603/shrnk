const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.cookies.access_token.split(" ")[1];

  if (!token) {
    return next({ code: 401, message: "Authentication error" });
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SALT);

  req.user = { userId: decodedToken.id };
  next();
};
