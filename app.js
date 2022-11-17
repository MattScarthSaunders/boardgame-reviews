const express = require("express");
const {
  catchAll,
  invalidURL,
  invalidId,
  customErrors,
  invalidContent,
  invalidQuery,
} = require("./controllers/errors.controllers.js");
const apiRouter = require("./routes/api.routers.js");

const app = express();
app.use(express.json());

app.use("/api", apiRouter);

//Errors

app.use(invalidQuery);
app.use(invalidId);
app.use(invalidContent);
app.use(customErrors);

app.all("/*", invalidURL);
app.use(catchAll);

//Export
module.exports = app;
