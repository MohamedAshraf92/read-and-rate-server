const Joi = require("joi");
const { initializeApp } = require("firebase/app");
require("firebase/storage");

const Author = require("../models/author");
// const { app } = require("../firebaseStorage");

exports.getAuthors = async (req, res, next) => {
  try {
    const authors = await Author.find().sort({ name: 1 });
    res.status(200).json(authors);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.addAuthor = async (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    birthday: Joi.string().required(),
    photo: Joi.any(),
  });

  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    console.log(validationResult.error);
    const error = new Error(validationResult.error);
    res
      .status(400)
      .json({ message: validationResult.error.details[0].message });
    throw error;
  }

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const birthday = req.body.birthday;
  const photo = req.file.path;

  const addedAuthor = await Author.findOne({
    firstName: firstName,
    lastName: lastName,
  });
  if (addedAuthor) {
    const error = new Error("Author already excists!");
    res.status(400).json({ message: "Author already excists!" });
    throw error;
  }

  try {
    const newAuthor = new Author({
      firstName: firstName,
      lastName: lastName,
      birthday: birthday,
      photo: photo,
    });
    const result = await newAuthor.save();
    res.status(201).json({
      message: "Author added successfully!",
      AuthorId: result._id,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
