const { getCategories } = require("../_controllers/categories.controllers");

const categoryRouter = require("express").Router();

categoryRouter.get("/", getCategories);

module.exports = categoryRouter;
