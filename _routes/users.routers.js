const { getUsers } = require("../_controllers/users.controllers");
const userRouter = require("express").Router();

userRouter.get("/", getUsers);

module.exports = userRouter;
