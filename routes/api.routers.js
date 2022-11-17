const apiRouter = require("express").Router();
const { getAPI } = require("../controllers/api.controllers");
const {
  categoryRouter,
  commentRouter,
  reviewRouter,
  userRouter,
} = require("./");

apiRouter.get("/", getAPI);
apiRouter.use("/categories", categoryRouter);
apiRouter.use("/reviews", reviewRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/comments", commentRouter);

module.exports = apiRouter;
