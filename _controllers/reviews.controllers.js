const {
  selectReviews,
  selectReviewById,
  selectCommentsByReview,
  insertComment,
  updateReviewVote,
  insertReview,
  removeReview,
} = require("../_models/reviews.models.js");

exports.getReviews = (req, res, next) => {
  selectReviews(req.query)
    .then((reviews) => {
      res.status(200).send({ total_count: reviews[1], reviews: reviews[0] });
    })
    .catch(next);
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

  selectCommentsByReview(review_id, req.query)
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

exports.patchReviewVote = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  updateReviewVote(review_id, inc_votes)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.postReview = (req, res, next) => {
  insertReview(req.body)
    .then((review) => {
      res.status(201).send({ review });
    })
    .catch(next);
};

exports.deleteReview = (req, res, next) => {
  const { review_id } = req.params;
  removeReview(review_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
