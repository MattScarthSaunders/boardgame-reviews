const { selectCategories } = require("../_models/categories.models.js");

exports.getCategories = (req, res) => {
  selectCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};
