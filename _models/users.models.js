const db = require("../db/connection.js");

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users;`).then((users) => {
    return users.rows;
  });
};

exports.selectUserByUsername = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((user) => {
      if (!user.rows[0]) {
        return Promise.reject({ status: 404, msg: "User not found" });
      }
      return user.rows[0];
    });
};
