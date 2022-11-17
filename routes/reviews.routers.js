const {
  getReviews,
  getReviewById,
  getCommentsByReview,
  patchReview,
  postCommentToReview,
} = require("../controllers/reviews.controllers");
const reviewRouter = require("express").Router();

reviewRouter.get("/", getReviews);
reviewRouter.route("/:review_id").get(getReviewById).patch(patchReview);
reviewRouter
  .route("/:review_id/comments")
  .get(getCommentsByReview)
  .post(postCommentToReview);

module.exports = reviewRouter;
