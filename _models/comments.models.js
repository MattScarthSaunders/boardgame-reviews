const db = require("../db/connection.js");

exports.removeCommentById = (commentId) => {
  return db
    .query(
      `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;`,
      [commentId]
    )
    .then((comment) => {
      if (!comment.rows.length) {
        return Promise.reject({ status: 404, msg: "ID not found" });
      }
    });
};

exports.updateCommentVote = (commentId, voteIncrement) => {
  return db
    .query(
      `
    UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *;`,
      [voteIncrement, commentId]
    )
    .then((comment) => {
      return comment.rows[0];
    });
};
