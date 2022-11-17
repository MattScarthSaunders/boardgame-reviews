const {
  deleteCommentById,
  patchCommentVote,
} = require("../_controllers/comments.controllers");
const commentRouter = require("express").Router();

commentRouter
  .route("/:comment_id")
  .patch(patchCommentVote)
  .delete(deleteCommentById);

module.exports = commentRouter;
