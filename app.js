const express = require("express");
const { catchAll, invalidURL } = require("./controllers/errors.controllers.js");
const {
  getCategories,
} = require("./controllers/games.categories.controllers.js");
const app = express();

app.get("/api/categories", getCategories);

app.all("/*", invalidURL);
app.use(catchAll);

module.exports = app;
