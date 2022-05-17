const db = require("../db/connection");
const reviews = require("../db/data/test-data/reviews");

exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categories`).then((categories) => {
    return categories.rows;
  });
};

exports.fetchReviewID = (reviewId) => {
    return db
      .query(`SELECT * FROM reviews WHERE review_id = $1`, [reviewId])
      .then((review) => {
          //console.log(review.rows, "<<<<");
        if (review.rows.length === 0) {
          return Promise.reject({ status: 404, msg: "not found" });
        }
        return review.rows[0];
      });
  };
