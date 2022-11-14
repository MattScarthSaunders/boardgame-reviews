const express = require("express");
const {
  catchAll,
  invalidURL,
  invalidId,
  idNotFound,
} = require("./controllers/errors.controllers.js");
const { getCategories } = require("./controllers/categories.controllers.js");
const {
  getReviews,
  getReviewById,
} = require("./controllers/reviews.controllers.js");
const app = express();

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);

//Errors

app.use(invalidId);
app.use(idNotFound);

app.all("/*", invalidURL);
app.use(catchAll);

//Export
module.exports = app;
