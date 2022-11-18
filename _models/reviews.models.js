const db = require("../db/connection.js");
const { checkExists } = require("../utils/utils.js");

exports.selectReviews = (queries) => {
  const {
    sort_by = "created_at",
    order = "desc",
    category,
    limit = 10,
    p = 0,
  } = queries;

  const queryKeys = Object.keys(queries);
  const validQueries = ["sort_by", "order", "category", "limit", "p"];
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

  //check if endpoint queries are valid
  if (!queryKeys.every((key) => validQueries.includes(key))) {
    return Promise.reject({ status: 400, msg: "Bad query" });
  }

  if (!validSorts.includes(sort_by) || (order !== "desc" && order !== "asc")) {
    return Promise.reject({ status: 400, msg: "Invalid Id or Query value" });
  }

  //assemble psql query
  let values = [];
  let queryArray = [];

  let offSet = p * limit;
  values.push(limit, offSet);

  let queryString = `
  SELECT reviews.*, COUNT(comments)::int as comment_count FROM reviews 
  LEFT JOIN comments ON reviews.review_id = comments.review_id
  `;

  if (category) {
    values.push(category);
    queryString += ` WHERE category = $3`;
    queryArray.push(checkExists("categories", "slug", category));
  }

  queryString += `GROUP BY reviews.review_id
                  ORDER BY ${sort_by} ${order}
                  LIMIT $1 OFFSET $2`;

  queryArray.push(db.query(`SELECT COUNT(*) AS total_count from reviews`));
  queryArray.push(db.query(queryString, values));

  return Promise.all(queryArray).then((checkedQueries) => {
    let lastIndex = checkedQueries.length - 1;
    let total_count = checkedQueries[lastIndex - 1].rows[0].total_count;
    return [checkedQueries[lastIndex].rows, Number(total_count)];
  });
};

exports.selectReviewById = (reviewId) => {
  return db
    .query(
      `SELECT reviews.*, COUNT(comments)::int as comment_count FROM reviews
       LEFT JOIN comments ON reviews.review_id = comments.review_id
       WHERE reviews.review_id = $1
       GROUP BY reviews.review_id;`,
      [reviewId]
    )
    .then((review) => {
      if (!review.rows.length) {
        return Promise.reject({ status: 404, msg: "ID not found" });
      } else {
        return review.rows[0];
      }
    });
};

exports.selectCommentsByReview = (reviewId, queries) => {
  const { limit = 10, p = 0 } = queries;

  const queryKeys = Object.keys(queries);
  const validQueries = ["limit", "p"];

  if (!queryKeys.every((key) => validQueries.includes(key))) {
    return Promise.reject({ status: 400, msg: "Bad query" });
  }

  const offSet = p * limit;

  return Promise.all([
    checkExists("reviews", "review_id", reviewId),
    db.query(
      `SELECT * FROM comments
       WHERE review_id = $1
       ORDER BY created_at DESC
       LIMIT $2
       OFFSET $3;`,
      [reviewId, limit, offSet]
    ),
  ]).then((checkedComments) => {
    return checkedComments[1].rows;
  });
};

exports.insertComment = (reviewId, body, username) => {
  const dateNow = new Date(new Date());
  const queryString = `
  INSERT INTO comments
    (body, votes, author, review_id, created_at)
  VALUES
    ($1,0,$2,$3,$4)
  RETURNING author AS username, body;`;

  return Promise.all([
    checkExists("reviews", "review_id", reviewId),
    db.query(queryString, [body, username, reviewId, dateNow]),
  ]).then((comment) => {
    return comment[1].rows[0];
  });
};

exports.updateReviewVote = (reviewId, voteIncrement) => {
  return Promise.all([
    checkExists("reviews", "review_id", reviewId),
    db.query(
      `
        UPDATE reviews
        SET votes = votes + $1
        WHERE review_id = $2
        RETURNING *;
        `,
      [voteIncrement, reviewId]
    ),
  ]).then((checkedReview) => {
    return checkedReview[1].rows[0];
  });
};

exports.insertReview = (reviewBody) => {
  const validProps = ["owner", "title", "designer", "category", "review_body"];
  const bodyValid = Object.keys(reviewBody).every((value) =>
    validProps.includes(value)
  );

  const values = Object.values(reviewBody);

  if (!bodyValid || values.length < 5) {
    return Promise.reject({ status: 400, msg: "Received invalid content" });
  }

  values.push(new Date(new Date()));

  return Promise.all([
    checkExists("categories", "slug", reviewBody.category),
    checkExists("users", "username", reviewBody.owner),
    db.query(
      `
      INSERT INTO reviews
        (owner, title, review_body, designer, category, votes, created_at)
      VALUES
        ($1,$2,$3,$4,$5,0,$6)
      RETURNING *;`,
      values
    ),
  ])
    .then((insertedReview) => {
      return this.selectReviewById(insertedReview[2].rows[0].review_id);
    })
    .then((selectedReview) => {
      let returnedReview = { ...selectedReview };
      delete returnedReview.review_img_url;
      return returnedReview;
    });
};

exports.removeReview = (reviewId) => {
  return db
    .query(
      `
    DELETE FROM reviews
    WHERE review_id = $1
    RETURNING*`,
      [reviewId]
    )
    .then((review) => {
      if (!review.rows.length) {
        return Promise.reject({ status: 404, msg: "ID not found" });
      }
    });
};
