const { checkExists } = require("../utils/utils.js");
const {
  selectReviews,
  selectReviewById,
  insertComment,
  selectCommentsByReview,
  updateReview,
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

  selectCommentsByReview(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentToReview = (req, res, next) => {
  const { review_id } = req.params;
  const { username, body } = req.body;

  insertComment(review_id, body, username)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.patchReview = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  updateReview(review_id, inc_votes)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
