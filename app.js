const express = require("express");
const {
  catchAll,
  invalidURL,
  customErrors,
  invalidContent,
  invalidIdOrQuery,
} = require("./_controllers/errors.controllers.js");
const apiRouter = require("./_routes/api.routers.js");

const app = express();
app.use(express.json());

app.use("/api", apiRouter);

//Errors

// app.use(invalidQuery);
app.use(invalidIdOrQuery);
app.use(invalidContent);
app.use(customErrors);

app.all("/*", invalidURL);
app.use(catchAll);

//Export
module.exports = app;
