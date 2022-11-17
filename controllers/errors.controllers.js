const { checkExists } = require("../utils/utils");

exports.catchAll = (err, req, res, next) => {
  console.log(err, "unhandled error");
  res.status(500).send({ msg: "internal server error" });
};

exports.invalidURL = (req, res) => {
  res.status(404).send({ msg: "Invalid URL" });
};

exports.invalidId = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid Id" });
  } else {
    next(err);
  }
};

exports.invalidContent = (err, req, res, next) => {
  if (err.code === "23502") {
    res.status(400).send({ msg: "Received invalid content" });
  } else {
    next(err);
  }
};

exports.customErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.invalidQuery = (err, req, res, next) => {
  if (err === "Bad query") {
    res.status(400).send({ msg: "Bad query" });
  } else {
    next(err);
  }
};
