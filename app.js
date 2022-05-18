const express = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");
const app = express();
const {getCategories, getReviewById, patchReviewVoteById} = require("./controllers/controllers");


app.use(express.json());



app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", patchReviewVoteById);

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
    if (err.status && err.msg) {
        res.status(err.status).send({msg: err.msg});
    }
    
})


  app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send( { msg: 'Internal server error'} );
})

module.exports = app;