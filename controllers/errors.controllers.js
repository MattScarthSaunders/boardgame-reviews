exports.catchAll = (err, req, res, next) => {
  console.log(err, "unhandled error");
  res.status(500).send({ msg: "internal server error" });
};

exports.invalidURL = (req, res) => {
  res.status(404).send({ msg: "Invalid URL" });
};
