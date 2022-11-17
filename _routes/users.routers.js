const {
  getUsers,
  getUserByUsername,
} = require("../_controllers/users.controllers");
const userRouter = require("express").Router();

userRouter.get("/", getUsers);
userRouter.get("/:username", getUserByUsername);

module.exports = userRouter;
