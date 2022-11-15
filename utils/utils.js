const db = require("../db/connection.js");
const format = require("pg-format");

exports.checkExists = (table, column, value) => {
  const queryStr = format(`SELECT * FROM %I WHERE %I = $1`, table, column);
  return db.query(queryStr, [value]).then((content) => {
    if (!content.rows.length) {
      return Promise.reject({ status: 404, msg: "Content not found" });
    }
  });
};
