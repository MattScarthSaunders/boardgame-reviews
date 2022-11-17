const {
  getReviews,
  getReviewById,
  getCommentsByReview,
  postCommentToReview,
  patchReviewVote,
} = require("../_controllers/reviews.controllers");
const reviewRouter = require("express").Router();

reviewRouter.get("/", getReviews);
reviewRouter.route("/:review_id").get(getReviewById).patch(patchReviewVote);
reviewRouter
  .route("/:review_id/comments")
  .get(getCommentsByReview)
  .post(postCommentToReview);

module.exports = reviewRouter;
