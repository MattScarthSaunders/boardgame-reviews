const db = require("../db/connection.js");
const { checkExists } = require("../utils/utils.js");

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

exports.selectReviewById = (review_id) => {
  return db
    .query(
      `SELECT * FROM reviews
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

exports.selectCommentsByReview = (review_id) => {
  return Promise.all([
    checkExists("reviews", "review_id", review_id),
    db.query(
      `SELECT * FROM comments
       WHERE review_id = $1
       ORDER BY created_at DESC;`,
      [review_id]
    ),
  ]).then((checkedComments) => {
    return checkedComments[1].rows;
  });
};

exports.insertComment = (review_id, body, username) => {
  const dateNow = new Date(new Date());
  const queryString = `
  INSERT INTO comments
    (body, votes, author, review_id, created_at)
  VALUES
    ($1,0,$2,$3,$4)
  RETURNING author AS username, body;`;

  return db
    .query(queryString, [body, username, review_id, dateNow])
    .then((comment) => {
      return comment.rows[0];
    });
};

exports.updateReview = (review_id, inc_votes) => {
  return Promise.all([
    checkExists("reviews", "review_id", review_id),
    db.query(
      `
      UPDATE reviews
      SET votes = votes + $1
      WHERE review_id = $2
      RETURNING *;
      `,
      [inc_votes, review_id]
    ),
  ]).then((review) => {
    return review[1].rows[0];
  });
};
