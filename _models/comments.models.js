const db = require("../db/connection.js");
const { checkExists } = require("../utils/utils.js");

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
  return Promise.all([
    checkExists("comments", "comment_id", commentId),
    db.query(
      `
    UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *;`,
      [voteIncrement, commentId]
    ),
  ]).then((checkedComment) => {
    return checkedComment[1].rows[0];
  });
};
