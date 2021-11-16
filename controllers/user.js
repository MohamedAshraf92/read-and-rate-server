const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: email });
    if (!user && user.role !== "user") {
      const error = new Error("A user with this email could not be found.");
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Wrong password!");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
        role: user.role,
      },
      "topsecrectreadandrate",
      { expiresIn: "10h" }
    );

    const sentUser = {
      role: user.role,
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      books: user.books,
    };

    res.status(200).json({ token: token, user: sentUser });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.adminLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: email });
    if (!user && user.role !== "admin") {
      const error = new Error("A user with this email could not be found.");
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Wrong password!");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
        role: user.role,
      },
      "topsecrectreadandrate",
      { expiresIn: "1h" }
    );

    const sentUser = {
      role: user.role,
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      books: user.books,
    };

    res.status(200).json({ token: token, user: sentUser });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  const schema = Joi.object({
    role: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().required(),
    avatar: Joi.string(),
  });

  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    console.log(validationResult.error);
    const error = new Error(validationResult.error);
    res.status(400).json({ error: validationResult.error.details[0].message });
    throw error;
  }

  const role = req.body.role;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;

  const registeredEmail = await User.findOne({ email: email });
  if (registeredEmail) {
    const error = new Error("E-Mail address already exists!");
    res.status(400).json({ message: "E-Mail address already exists!" });
    throw error;
  }

  try {
    const hashedPW = await bcrypt.hash(password, 12);

    const user = new User({
      role,
      firstName,
      lastName,
      email,
      password: hashedPW,
    });

    const result = await user.save();
    res.status(201).json({ message: "User created!", userId: result._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
