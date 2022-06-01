const db = require("../db/connection");
const reviews = require("../db/data/test-data/reviews");

exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categories`).then((categories) => {
    return categories.rows;
  });
};

exports.fetchReviewID = (reviewId) => {
    return db
      .query(`SELECT reviews.*, COUNT(comment_id)::int AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id 
      WHERE reviews.review_id = $1
      GROUP BY reviews.review_id` , [reviewId])
      .then((review) => {
        //console.log(review.rows, "<<<<");
        if (review.rows.length === 0) {
          return Promise.reject({ status: 404, msg: "not found" });
        }
        return review.rows[0];
      });
  };

  exports.updatePatchReview = (votes, reviewId) => {
      return db
        .query(
          `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *`,
          [votes, reviewId]
        )
        .then((review) => {
          if (review.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "not found" });
          }
          return review.rows[0];
        });
    }; 

    exports.fetchUsers = () => {
        return db.query(`SELECT * FROM users`)
            .then((response) => {
                return response.rows;
            });
        };


        exports.fetchReviews = () => {
          return db.query(`
          SELECT 
              reviews.review_id,    
              reviews.owner, 
              reviews.title, 
              reviews.category, 
              reviews.review_img_url, 
              reviews.created_at, 
              reviews.votes, 
          COUNT(comments.review_id)::INT AS comment_count 
          FROM reviews
          LEFT JOIN comments ON comments.review_id = reviews.review_id 
          GROUP BY reviews.review_id
          ORDER BY created_at DESC;`)
              .then((result) => {
                  return result.rows;
              });
      };




        exports.fetchCommentsByID = (review_id) => {
            
            const bodyRev = db.query(`SELECT review_id FROM reviews WHERE review_id = $1;`, [review_id]);

            const bodyComm = db.query(`SELECT * FROM comments WHERE review_id = $1`, [review_id])
                
            return Promise.all([bodyRev, bodyComm])
                    .then(([bodyRev, bodyComm]) => {
                        if(!bodyRev.rows.length) {
                        return Promise.reject
                        ({ status: 404, msg: `No review found for review_id: ${review_id}`});
                        } 
                        return bodyComm.rows;
                    });
        };
           
    exports.addCommentByReviewId = (body, username, review_id) => {
        return db
        .query(`INSERT INTO comments (author, body, review_id)
        VALUES ($1,$2,$3)
        RETURNING *;`,  [username, body, review_id]
        )
        .then((response) => {
            return response.rows[0];
          });
    }


    exports.fetchAllReviews = (
      sort_by = "created_at",
      order = "DESC",
      category
    ) => {
      if (
        !["title", "designer", "owner", "category", "created_at"].includes(sort_by)
      ) {
        return Promise.reject({
          status: 400,
          message: "bad request",
        });
      }
    
      if (!["asc", "desc", "ASC", "DESC"].includes(order)) {
        return Promise.reject({
          status: 400,
          message: "bad request",
        });
      }
    
      db.query(`SELECT slug FROM categories`).then(({ rows }) => {
        const categoryList = rows.map((category) => category.slug);
        if (category & !categoryList.includes(category)) {
          return Promise.reject({
            status: 404,
            message: "not found",
          });
        }
      });
    
      let queryString = `SELECT reviews.*, COUNT (comment_id) ::int AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id`;
    
      order = order.toUpperCase();
      if (category) {
        queryString += ` WHERE reviews.category = '${category}'`;
      }
    
      queryString += ` GROUP BY reviews.review_id ORDER BY reviews.${sort_by} ${order};`;
    
      return db.query(queryString).then(({ rows }) => {
        if (!rows.length) {
          return Promise.reject({
            status: 404,
            message: "not found",
          });
        } else return rows;
      });
    };