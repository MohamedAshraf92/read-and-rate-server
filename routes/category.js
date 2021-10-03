const express = require("express");

const categoriesController = require("../controllers/category");
const isAdmin = require("../middleware/is-admin");

const router = express.Router();

router.get("/", categoriesController.getCategories);

router.post("/", isAdmin, categoriesController.addCategory);

router.patch("/", isAdmin, categoriesController.editCategory);

router.delete("/", isAdmin, categoriesController.deleteCategory);

module.exports = router;
