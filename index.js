const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();
//Routes
const urlsRoutes = require("./routes/urls.routes");
const usersRoutes = require("./routes/users.routes");

const PublicUrl = require("./models/PublicUrl.model");
const PrivateUrl = require("./models/Url.model");

const app = express();
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join("public")));

app.use("/api/urls", urlsRoutes);
app.use("/api/users", usersRoutes);

app.use("/:hash", async (req, res, next) => {
  const { hash } = req.params;

  try {
    const publicUrl = await PublicUrl.findOne({ hash });
    if (publicUrl) {
      return res.redirect(publicUrl.originalURL);
    }

    const privateUrl = await PrivateUrl.findOne({ hash });
    if (privateUrl) {
      return res.redirect(privateUrl.originalURL);
    }
  } catch (error) {
    return next();
  }

  return next({ code: 404, message: "페이지를 찾을 수 없습니다." });
});

app.use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

// error handler
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  if (error.code === 404) {
    return res.status(404).send("<h1>존재하지 않는 페이지입니다 :(</h1>");
  }

  res.status(error.code || 500).json({
    message: error.message || "서버 에러가 발생하였습니다. 다시 시도해주세요.",
  });
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Connected to mongo server...");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.log(err));
