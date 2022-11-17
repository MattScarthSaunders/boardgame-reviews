const { readEndpoints } = require("../models/api.models");

exports.getAPI = (req, res) => {
  readEndpoints().then((endpoints) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(endpoints);
  });
};
