const db = require("../db/connection.js");

exports.selectCategories = () => {
  return db.query(`SELECT * FROM categories;`).then((categories) => {
    return categories.rows;
  });
};

exports.selectReviewById = (review_id) => {
  return db
    .query(
      `SELECT reviews.*, categories.slug AS category FROM reviews
    JOIN categories ON reviews.category = categories.slug
    WHERE review_id = $1;`,
      [review_id]
    )
    .then((review) => {
      if (!review.rows.length) {
        return Promise.reject({ status: 404, msg: "ID not found" });
      } else {
        return review.rows[0];
      }
    });
};
