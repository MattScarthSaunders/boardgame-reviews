const { deleteCommentById } = require("../_controllers/comments.controllers");
const commentRouter = require("express").Router();

commentRouter.delete("/:comment_id", deleteCommentById);

module.exports = commentRouter;
