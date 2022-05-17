const {fetchCategories, fetchReviewID} = require("../models/models");
  
  exports.getCategories = (req, res, next) => {
    fetchCategories()
      .then((categories) => {
        res.status(200).send({ categories: categories });
      })
      .then((err) => {
        next(err);
      });
  };

  exports.getReviewById = (req, res, next) => {
    const { review_id: reviewId } = req.params;
    console.log(reviewId, "controller");
    fetchReviewID(reviewId)
      .then((review) => {
        res.status(200).send({ review });
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  };
