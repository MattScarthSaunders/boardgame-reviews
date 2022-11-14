const express = require("express");
const {
  catchAll,
  invalidURL,
  invalidId,
  idNotFound,
} = require("./controllers/errors.controllers.js");
const {
  getCategories,
  getReviewById,
} = require("./controllers/games.controllers.js");
const app = express();

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);

//Errors

app.use(invalidId);
app.use(idNotFound);

app.all("/*", invalidURL);
app.use(catchAll);

//Export
module.exports = app;
