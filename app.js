const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
require("dotenv").config();

const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const authorRoutes = require("./routes/author");

const app = express();

app.use(express.json());
app.use(cors());

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.parse(new Date()) + "-" + file.originalname);
  },
});

app.use(multer({ storage: fileStorage }).single("photo"));

app.use("/images", express.static("images"));

app.use("/user", userRoutes);
app.use("/category", categoryRoutes);
app.use("/author", authorRoutes);

mongoose
  .connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    app.listen(8080);
    console.log(`Server running on port 8080`);
  })
  .catch((err) => console.log(err));
