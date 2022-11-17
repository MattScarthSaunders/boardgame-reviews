const { getCategories } = require("../controllers/categories.controllers");

const categoryRouter = require("express").Router();

categoryRouter.get("/", getCategories);

module.exports = categoryRouter;
