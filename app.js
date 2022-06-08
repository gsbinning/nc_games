const express = require("express");
const app = express();
const {getCategories, getReviewById, patchReviewVoteById, getUsers, getReviews, getCommentsByID, postCommentsByReviewId, deleteComment} = require("./controllers/controllers");
const { apiJSON } = require('./controllers/api.controller');

app.use(express.json());



app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/users", getUsers);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id/comments", getCommentsByID);
app.get('/api',apiJSON)


app.patch("/api/reviews/:review_id", patchReviewVoteById);


app.post('/api/reviews/:review_id/comments',postCommentsByReviewId)


app.delete("/api/comments/:comment_id", deleteComment);

app.all("/*", (req, res) => {
    res.status(404).send({ msg: "not found" });
  });


  app.use((err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ msg: "bad request" })
    } else {
        next(err);
    }
})


app.use((err, req, res, next) => {
    if (err.code === "23502") {
        res.status(400).send({ msg: "bad request" })
    } else {
        next(err);
    }
})


app.use((err, req, res, next) => {
    if (err.code === "23503") {
        res.status(404).send({ msg: "not found" })
    } else {
        next(err);
    }
})

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({msg: err.msg});
    } else {
    next(err);
    }
})


  app.use((err, req, res, next) => {
    res.status(500).send( { msg: 'Internal server error'} );
})

module.exports = app;