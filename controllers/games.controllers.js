const {
  selectCategories,
  selectReviewById,
} = require("../models/games.models.js");

exports.getCategories = (req, res) => {
  selectCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};

exports.getReviewById = (req, res) => {
  const { review_id } = req.params;
  selectReviewById(review_id).then((review) => {
    res.status(200).send({ review });
  });
};
