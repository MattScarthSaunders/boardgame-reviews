const express = require("express");
const {
  catchAll,
  invalidURL,
  invalidId,
  customErrors,
} = require("./controllers/errors.controllers.js");
const { getCategories } = require("./controllers/categories.controllers.js");
const {
  getReviews,
  getReviewById,
  getCommentsByReview,
  patchReview,
} = require("./controllers/reviews.controllers.js");
const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsByReview);

app.patch("/api/reviews/:review_id", patchReview);

//Errors

app.use(invalidId);
app.use(customErrors);

app.all("/*", invalidURL);
app.use(catchAll);

//Export
module.exports = app;
