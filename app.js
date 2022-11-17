const express = require("express");
const {
  catchAll,
  invalidURL,
  invalidId,
  customErrors,
  invalidContent,
} = require("./controllers/errors.controllers.js");
const { getCategories } = require("./controllers/categories.controllers.js");
const {
  getReviews,
  getReviewById,
  getCommentsByReview,
  patchReview,
  postCommentToReview,
} = require("./controllers/reviews.controllers.js");
const { getUsers } = require("./controllers/users.controllers.js");
const { getAPI } = require("./controllers/api.controllers.js");

const app = express();
app.use(express.json());

app.get("/api", getAPI);
app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/users", getUsers);
app.get("/api/reviews/:review_id/comments", getCommentsByReview);

app.patch("/api/reviews/:review_id", patchReview);
app.post("/api/reviews/:review_id/comments", postCommentToReview);

//Errors

app.use(invalidId);
app.use(invalidContent);
app.use(customErrors);

app.all("/*", invalidURL);
app.use(catchAll);

//Export
module.exports = app;
