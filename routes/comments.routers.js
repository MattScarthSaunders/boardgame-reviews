const { deleteCommentById } = require("../controllers/comments.controllers");
const commentRouter = require("express").Router();

commentRouter.delete("/:comment_id", deleteCommentById);

module.exports = commentRouter;
