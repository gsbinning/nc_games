const {fetchCategories, fetchReviewID, updatePatchReview, fetchUsers} = require("../models/models");
  
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
    //console.log(reviewId, "controller");
    fetchReviewID(reviewId)
      .then((review) => {
        res.status(200).send({ review });
      })
      .catch((err) => {
        //console.log(err);
        next(err);
      });
  };

  exports.patchReviewVoteById = (req, res, next) => {
    const { inc_votes: votes } = req.body;
    const { review_id: reviewId } = req.params;
    //console.log(votes);
    updatePatchReview(votes, reviewId)
      .then((review) => {
        res.status(200).send({ review: review });
      })
      .catch((err) => {
        next(err);
      });
  };

  exports.getUsers = (req, res, next) => {
    fetchUsers()
      .then((users) => {
        console.log(users, "<<<<<");
        res.status(200).send({ users: users });
      })
      //.catch(err);
  };



