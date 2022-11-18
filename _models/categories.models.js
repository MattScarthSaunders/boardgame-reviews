const db = require("../db/connection.js");

exports.selectCategories = () => {
  return db.query(`SELECT * FROM categories;`).then((categories) => {
    return categories.rows;
  });
};

exports.insertCategory = (body) => {
  const { slug, description } = body;

  if (!description) {
    return Promise.reject({ status: 400, msg: "Received invalid content" });
  }

  return db
    .query(
      `
    INSERT INTO categories
      (slug,description)
    VALUES
      ($1, $2)
    RETURNING *`,
      [slug, description]
    )
    .then((category) => {
      return category.rows[0];
    });
};
