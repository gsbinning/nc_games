const {fetchCategories, fetchReviewID, updatePatchReview, fetchUsers, fetchReviews, fetchCommentsByID, addCommentByReviewId} = require("../models/models");
  
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
    fetchReviewID(reviewId)
      .then((review) => {
        res.status(200).send({ review });
      })
      .catch((err) => {
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
        res.status(200).send({ users: users });
      })
      .catch((err) => {
        next(err);
    })
  };

  exports.getReviews = (req, res, next) => {
    fetchReviews().then((reviews) => {
      res.status(200).send({ reviews: reviews });
    })
    .catch((err) => {
      next(err);
  })
  };



  exports.getCommentsByID = (req, res, next) => {
    const { review_id } = req.params;
    fetchCommentsByID(review_id).then((comments) => {
        res.status(200).send({ comments });
    }).catch((err) => {
        next(err);
    })
};

exports.postCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  const { body, username } = req.body;
  addCommentByReviewId(body, username, review_id)
    .then((comment) => {
      res.status(201).send({ comment });
    }).catch((err) => {
      next(err);
  })

};

