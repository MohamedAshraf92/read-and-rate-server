const Joi = require("joi");
const fs = require("fs");

const Book = require("../models/book");

exports.getBooks = async (req, res, next) => {
  try {
    const books = await Book.find().sort({ name: 1 });
    res.status(200).json(books);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.addBook = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    authors: Joi.array().required(),
    categories: Joi.array().required(),
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

  const { name, description, authors, categories } = req.body;
  const photo = req.file.path;

  const addedBook = await Book.findOne({
    name: name,
  });
  if (addedBook) {
    const error = new Error("Book already excists!");
    res.status(400).json({ message: "Book already excists!" });
    throw error;
  }

  try {
    const newBook = new Book({
      name,
      description,
      authors,
      categories,
      photo,
    });
    const result = await newBook.save();
    res.status(201).json({
      message: "Book added successfully!",
      BookId: result._id,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.editBook = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    authors: Joi.array().required(),
    categories: Joi.array().required(),
    photo: Joi.any(),
    bookId: Joi.string().required(),
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

  const { name, description, authors, categories, bookId } = req.body;

  const editedBook = await Book.findById(bookId);

  let photoLink = editedBook.photo;

  if (!editedBook) {
    const error = new Error("Can not find the selected book");
    res.status(400).json({ message: "Can not find the selected book" });
    throw error;
  }

  try {
    if (req.file) {
      photoLink = req.file.path;
      const oldPhotoLink = editedBook.photo;
      fs.unlink(oldPhotoLink, (err) => {
        if (err) console.log(err);
      });
    }
    editedBook.name = name;
    editedBook.description = description;
    editedBook.authors = authors;
    editedBook.categories = categories;
    editedBook.photo = photoLink;
    await editedBook.save();
    res.status(200).json({ message: "Book data changed successfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteBook = async (req, res, next) => {
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
    const deletedBook = await Book.findByIdAndRemove(req.body.id);
    if (!deletedBook) {
      const error = new Error("Can not find the selected book");
      res.status(400).json({ message: "Can not find the selected book" });
      throw error;
    }
    fs.unlink(deletedBook.photo, (err) => {
      if (err) console.log(err);
    });
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
