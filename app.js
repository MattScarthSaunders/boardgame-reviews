const express = require("express");
const { catchAll, invalidURL } = require("./controllers/errors.controllers.js");
const {
  getCategories,
  getReviews,
} = require("./controllers/games.controllers.js");
const app = express();

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);

app.all("/*", invalidURL);
app.use(catchAll);

module.exports = app;
