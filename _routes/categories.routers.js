const {
  getCategories,
  postCategory,
} = require("../_controllers/categories.controllers");

const categoryRouter = require("express").Router();

categoryRouter.route("/").get(getCategories).post(postCategory);

module.exports = categoryRouter;
