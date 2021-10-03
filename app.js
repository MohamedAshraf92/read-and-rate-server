const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/user", userRoutes);
app.use("/category", categoryRoutes);

mongoose
  .connect(
    "mongodb+srv://mohamedashraf92:pinkslap0-@readandrate.l9n6w.mongodb.net/readAndRate?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((result) => {
    app.listen(8080);
    console.log(`Server running on port 8080`);
  })
  .catch((err) => console.log(err));
