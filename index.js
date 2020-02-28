const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
//Routes
const urlsRoutes = require("./routes/urls.routes");
const usersRoutes = require("./routes/users.routes");

const app = express();
app.use(express.json());

app.use("/api/urls", urlsRoutes);
app.use("/api/users", usersRoutes);

// unhandled route catcher
app.use((req, res, next) => {
  next({ code: 404, message: "Page not found" });
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
    app.listen(5000, () => {
      console.log(`Server running on port 5000`);
    });
  })
  .catch(err => console.log(err));
