const express = require("express");

const booksController = require("../controllers/book");
const isAdmin = require("../middleware/is-admin");

const router = express.Router();

router.get("/", booksController.getBooks);

router.post("/", isAdmin, booksController.addBook);

router.patch("/", isAdmin, booksController.editBook);

router.delete("/", isAdmin, booksController.deleteBook);

module.exports = router;
