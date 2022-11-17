const db = require("../db/connection.js");
const { checkExists, checkCategory } = require("../utils/utils.js");

exports.selectReviews = (sortTerm = "created_at", order = "desc", category) => {
  let values = [];

  const validSorts = [
    "review_id",
    "title",
    "designer",
    "owner",
    "review_img_url",
    "review_body",
    "category",
    "created_at",
    "votes",
    "comment_count",
  ];

  if (!validSorts.includes(sortTerm)) {
    return Promise.reject({ status: 400, msg: "Bad query" });
  }

  if (order !== "desc" && order !== "asc") {
    return Promise.reject({ status: 400, msg: "Bad query" });
  }

  let queryString = `
  SELECT reviews.*, COUNT(comments)::int as comment_count FROM reviews 
  LEFT JOIN comments ON reviews.review_id = comments.review_id
  `;

  if (category) {
    queryString += ` WHERE category = $1`;
    values.push(category);
    queryString += `GROUP BY reviews.review_id ORDER BY ${sortTerm} ${order}`;

    return Promise.all([
      checkExists("categories", "slug", category),
      db.query(queryString, values),
    ]).then((checkedReviews) => {
      return checkedReviews[1].rows;
    });
  } else {
    queryString += `GROUP BY reviews.review_id ORDER BY ${sortTerm} ${order}`;

    return db.query(queryString, values).then((reviews) => {
      return reviews.rows;
    });
  }
};

exports.selectReviewById = (review_id) => {
  return db
    .query(
      `SELECT reviews.*, COUNT(comments)::int as comment_count FROM reviews
       LEFT JOIN comments ON reviews.review_id = comments.review_id
       WHERE reviews.review_id = $1
       GROUP BY reviews.review_id;`,
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

  return Promise.all([
    checkExists("reviews", "review_id", review_id),
    db.query(queryString, [body, username, review_id, dateNow]),
  ]).then((comment) => {
    return comment[1].rows[0];
  });
};

exports.updateReviewVote = (review_id, inc_votes) => {
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
