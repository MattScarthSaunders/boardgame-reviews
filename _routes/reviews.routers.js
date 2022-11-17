const {
  getReviews,
  getReviewById,
  getCommentsByReview,
  postCommentToReview,
  patchReviewVote,
  postReview,
} = require("../_controllers/reviews.controllers");
const reviewRouter = require("express").Router();

reviewRouter.route("/").get(getReviews).post(postReview);
reviewRouter.route("/:review_id").get(getReviewById).patch(patchReviewVote);
reviewRouter
  .route("/:review_id/comments")
  .get(getCommentsByReview)
  .post(postCommentToReview);

module.exports = reviewRouter;
