const {
  selectCategories,
  insertCategory,
} = require("../_models/categories.models.js");

exports.getCategories = (req, res) => {
  selectCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};

exports.postCategory = (req, res, next) => {
  insertCategory(req.body)
    .then((category) => {
      res.status(201).send({ category });
    })
    .catch(next);
};
