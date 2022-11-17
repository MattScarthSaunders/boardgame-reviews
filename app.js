const express = require("express");
const {
  catchAll,
  invalidURL,
  invalidId,
  customErrors,
  invalidContent,
  invalidQuery,
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
const { deleteCommentById } = require("./controllers/comments.controllers.js");
const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsByReview);
app.get("/api/users", getUsers);

app.patch("/api/reviews/:review_id", patchReview);
app.post("/api/reviews/:review_id/comments", postCommentToReview);

app.delete("/api/comments/:comment_id", deleteCommentById);

//Errors

app.use(invalidQuery);
app.use(invalidId);
app.use(invalidContent);
app.use(customErrors);

app.all("/*", invalidURL);
app.use(catchAll);

//Export
module.exports = app;
