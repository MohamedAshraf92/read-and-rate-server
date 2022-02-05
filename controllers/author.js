const Joi = require("joi");
const fs = require("fs");

const Author = require("../models/author");

exports.getAuthors = async (req, res, next) => {
  try {
    const authors = await Author.find().sort({ firstName: 1, lastName: 1 });
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

  const { firstName, lastName, birthday } = req.body;
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

exports.editAuthor = async (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    birthday: Joi.string().required(),
    authorId: Joi.string().required(),
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

  const { firstName, lastName, birthday, authorId } = req.body;

  const editedAuthor = await Author.findById(authorId);

  let photoLink = editedAuthor.photo;

  if (!editedAuthor) {
    const error = new Error("Can not find the selected author");
    res.status(400).json({ message: "Can not find the selected author" });
    throw error;
  }

  try {
    if (req.file) {
      photoLink = req.file.path;
      const oldPhotoLink = editedAuthor.photo;
      fs.unlink(oldPhotoLink, (err) => {
        if (err) console.log(err);
      });
    }

    editedAuthor.firstName = firstName;
    editedAuthor.lastName = lastName;
    editedAuthor.birthday = birthday;
    editedAuthor.photo = photoLink;

    await editedAuthor.save();
    res.status(200).json({ message: "Author data changed successfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteAuthor = async (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().required(),
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

  try {
    const deletedAuthor = await Author.findByIdAndRemove(req.body.id);
    if (!deletedAuthor) {
      const error = new Error("Can not find the selected author");
      res.status(400).json({ message: "Can not find the selected author" });
      throw error;
    }
    fs.unlink(deletedAuthor.photo, (err) => {
      if (err) console.log(err);
    });
    res.status(200).json({ message: "Author deleted successfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
