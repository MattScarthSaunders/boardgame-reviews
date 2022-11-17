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
