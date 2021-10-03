const Joi = require("joi");

const Category = require("../models/category");

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find()
      // .populate("relatedBooks")
      .sort({ name: 1 });

    res.status(200).json(categories);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.addCategory = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
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

  const name = req.body.name;

  const addedCategory = await Category.findOne({ name: name });
  if (addedCategory) {
    const error = new Error("Category name already excists!");
    res.status(400).json({ message: "Category name already excists!" });
    throw error;
  }

  try {
    const newCategory = new Category({ name: name });
    const result = await newCategory.save();
    res.status(201).json({
      message: "Category added successfully!",
      categoryID: result._id,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.editCategory = async (req, res, next) => {
  const schema = Joi.object({
    categoryId: Joi.string().required(),
    newName: Joi.string().required(),
  });

  const categoreyId = req.body.categoryId;
  const newName = req.body.newName;

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
    const category = await Category.findById(categoreyId);
    if (!category) {
      const error = new Error("Can not find the selected category");
      res.status(400).json({ message: "Can not find the selected category" });
      throw error;
    }

    category.name = newName;
    await category.save();
    res.status(200).json({ message: "Category name changed successfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
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
    await Category.findByIdAndRemove(req.body.id, (err) => {
      if (err) {
        const error = new Error("Can not find the selected category");
        res.status(400).json({ message: "Can not delete category" });
        throw error;
      }
      res.status(200).json({ message: "Category deleted successfully" });
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
