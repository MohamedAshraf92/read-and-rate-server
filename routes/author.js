const express = require("express");

const authorsController = require("../controllers/author");
const isAdmin = require("../middleware/is-admin");

const router = express.Router();

router.get("/", authorsController.getAuthors);

router.post("/", isAdmin, authorsController.addAuthor);

router.patch("/", isAdmin, authorsController.editAuthor);

router.delete("/", isAdmin, authorsController.deleteAuthor);

module.exports = router;
