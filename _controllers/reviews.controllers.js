const {
  selectReviews,
  selectReviewById,
  selectCommentsByReview,
  insertComment,
  updateReviewVote,
  insertReview,
} = require("../_models/reviews.models.js");

exports.getReviews = (req, res, next) => {
  // const { sort_by, order, category } = req.query;
  // const queryKeys = Object.keys(req.query);
  // const validQueries = ["sort_by", "order", "category"];

  // if (!queryKeys.every((key) => validQueries.includes(key))) {
  //   next("Bad query");
  // } else {
  selectReviews(req.query)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
  // }
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
