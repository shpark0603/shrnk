const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");

require("dotenv").config();
//Routes
const urlsRoutes = require("./routes/urls.routes");
const usersRoutes = require("./routes/users.routes");

const PublicUrl = require("./models/PublicUrl.model");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join("public")));

app.use("/api/urls", urlsRoutes);
app.use("/api/users", usersRoutes);

app.use("/:hash", async (req, res, next) => {
  const { hash } = req.params;

  let publicUrl;
  try {
    publicUrl = await PublicUrl.findOne({ hash });
    if (!publicUrl) {
      return next();
    }
  } catch (error) {
    return next({ code: 500 });
  }

  res.redirect(publicUrl.originalURL);
});

app.use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

// error handler
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(err);
  }

  res.status(error.code || 500).json({
    message: error.message || "Internal Server Error, please try again."
  });
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("Connected to mongo server...");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.log(err));
