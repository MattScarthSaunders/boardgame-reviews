const db = require("../db/connection.js");

exports.selectReviews = () => {
  return db
    .query(
      `
      SELECT reviews.*, COUNT(comments)::int as comment_count FROM reviews 
      LEFT JOIN comments ON reviews.review_id = comments.review_id
      GROUP BY reviews.review_id
      ORDER BY created_at DESC`
    )
    .then((reviews) => {
      return reviews.rows;
    });
};
