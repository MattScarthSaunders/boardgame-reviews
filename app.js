const express = require("express");
const { catchAll, invalidURL } = require("./controllers/errors.controllers.js");
const {
  getCategories,
  getReviewById,
} = require("./controllers/games.controllers.js");
const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById);

app.all("/*", invalidURL);
app.use(catchAll);

module.exports = app;
