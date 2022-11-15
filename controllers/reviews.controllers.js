const {
  selectReviews,
  selectReviewById,
  selectCommentsByReview,
  checkReviewExists,
} = require("../models/reviews.models.js");

exports.getReviews = (req, res) => {
  selectReviews().then((reviews) => {
    res.status(200).send({ reviews });
  });
};

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.getCommentsByReview = (req, res, next) => {
  const { review_id } = req.params;
  checkReviewExists(review_id)
    .then(() => {
      return selectCommentsByReview(review_id);
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
