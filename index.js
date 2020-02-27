const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
//Routes
const homeRoute = require("./routes/home.route");

const app = express();
app.use(express.json());

app.use("/api", homeRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log("Connected to mongo"));

  console.log(`Server running on port ${PORT}`);
});
