const { readFile } = require("fs/promises");

exports.readEndpoints = () => {
  return readFile(`${__dirname}/../endpoints.json`, "utf-8").then((data) => {
    return data;
  });
};
