const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/categories ", () => {
  test("200: returns an array of category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body.categories)).toBe(true);
        expect(res.body.categories).toHaveLength(4);
        expect(Object.keys(res.body.categories[0])).toEqual([
          "slug",
          "description",
        ]);
      });
  });
});

test("404: Not Found categories", () => {
  return request(app)
    .get("/api/cetegories")
    .expect(404)
    .then((res) => {
      expect(res.body.msg).toBe("not found");
    });
});

describe("GET /api/reviews/:review_id", () => {
  test("200: responds with a single review when passed review_id", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toBeInstanceOf(Object);
        expect(body.review).toEqual(
          expect.objectContaining({
            review_id: 1,
            title: "Agricola",
            review_body: "Farmyard fun!",
            designer: "Uwe Rosenberg",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            votes: 1,
            category: "euro game",
            owner: "mallionaire",
            created_at: "2021-01-18T10:00:20.514Z",
          })
        );
      });
  });

  test("404: returns error message when called a valid data but non-existent review id", () => {
    return request(app)
      .get("/api/reviews/666")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("not found");
      });
  });

  test("400: responds with status code 400 and msg 'bad request' when entering wrong data type for review_id", () => {
    return request(app)
      .get("/api/reviews/bananas")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });

  test("200: should add comment_count to GET review. This will include a comment_count property with the correct value for the review_id passed", () => {
    const review_id = 1;
    return request(app)
      .get(`/api/reviews/${review_id}`)
      .expect(200)
      .then(({ body }) => {
        //console.log(body.review);
        expect(body.review).toEqual(
          expect.objectContaining({
            comment_count: 0,
          })
        );
      });
  });

  describe("PATCH /api/reviews/:review_id", () => {
    test("200:return the updated vote in the response body", () => {
      const reqBody = { inc_votes: 100 };
      return request(app)
        .patch("/api/reviews/1")
        .send(reqBody)
        .expect(200)
        .then(({ body }) => {
          expect(body.review.review_id).toBe(1);
          expect(body.review.votes).toBe(101);
        });
    });

    test("200: returns returns updated review object when new votes is a negative number", () => {
      const reqBody = { inc_votes: -2 };
      return request(app)
        .patch("/api/reviews/2")
        .send(reqBody)
        .expect(200)
        .then((res) => {
          expect(res.body.review).toEqual({
            review_id: 2,
            title: "Jenga",
            designer: "Leslie Scott",
            owner: "philippaclaire9",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_body: "Fiddly fun for all the family",
            category: "dexterity",
            created_at: "2021-01-18T10:01:41.251Z",
            votes: 3,
          });
        });
    });

    test("404: when provided with a valid but non-existent review id", () => {
      const reqBody = { inc_votes: 1 };
      return request(app)
        .get("/api/reviews/1000")
        .send(reqBody)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("not found");
        });
    });

    test("400: returns bad request error message when called with a review id of wrong data type", () => {
      const reqBody = { inc_votes: 7 };
         return request(app)
        .patch("/api/reviews/bananas")
        .send(reqBody)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("bad request");
        });
    });

    test("400: returns an error message when called with a float/decimal number ", () => {
      const reqBody = { inc_votes: "5.5" };
         return request(app)
        .patch("/api/reviews/1")
        .send(reqBody)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("bad request");
        });
    });
    test("400: returns when vote is not a number", () => {
      return request(app)
        .patch("/api/reviews/6")
        .send({ inc_votes: "doggy" })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("bad request");
        });
    });
  });
  describe("GET /api/users", () => {
    test("200:should respond with an array of objects, each object should have the following property: username", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          expect(response.body.users).toHaveLength(4);
          expect(response.body.users).toBeInstanceOf(Array);
          response.body.users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
                avatar_url: expect.any(String),
                name: expect.any(String),
              })
            );
          });
        });
    });
  });
});

describe("GET /api/reviews", () => {
  test("200: should return all reviews", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toEqual(expect.any(Array));
        expect(res.body.reviews).toHaveLength(13);
        expect(typeof res.body.reviews[0]).toEqual("object");
        expect.objectContaining({
          owner: expect.any(String),
          title: expect.any(String),
          review_id: expect.any(Number),
          category: expect.any(String),
          review_img_url: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(String),
        });
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("200: should respond with an array of comments for the given review_id", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(3);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              review_id: expect.any(Number),
            })
          );
        });
      });
  });

  test("400: Should return a status code of 400 when an incorrect data type is passed into the endpoint", () => {
    return request(app)
      .get("/api/reviews/yoyo/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
  test("200: returns 200 with an empty array when there are no comments for the given review id", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });

  test("404: should respond with not found if passed a valid number but not one that match a Valid ID in the path ", () => {
    return request(app)
      .get("/api/reviews/99/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No review found for review_id: 99");
      });
  });
});
describe("POST /api/reviews/:review_id/comments", () => {
  test("201 Created. Responds with the a new posted comment to the comments array of the review_id", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({ username: "philippaclaire9", body: "Best game ever" })
      .expect(201)
      .then((res) => {
        expect(res.body.comment).toMatchObject({
          comment_id: expect.any(Number),
          author: expect.any(String),
          review_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          body: expect.any(String),
        });
      });
  });
  test("status 400: Bad request error when the review_id is invalid", () => {
    const sendData = {
      username: "mallionaire",
      body: "very bad! boo!",
    };
    return request(app)
      .post("/api/reviews/yoyo/comments")
      .send(sendData)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: should return custom error if body does not contain both mandatory keys", () => {
    const addComment = { username: "mallionaire" };
    return request(app)
      .post("/api/reviews/2/comments")
      .send(addComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });

  test("404: should return not found user", () => {
    const addComment = {
      username: "gugz",
      body: "who wants to play a game of fifa?",
    };
    return request(app)
      .post("/api/reviews/5/comments")
      .send(addComment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });


//   test('404: should respond with "not found" if passed a valid number', () => {
//     return request(app)
//     .get('/api/reviews/2000022/comments')
//     .expect(404)
//     .then(({ body: { msg }}) => {
//         expect(msg).toBe('not found');
//     });
// });

test('404: should return a 404 error if review id in path does not exist but is a valid number', () => {
  const comment = {
      username: 'mallionaire',
      body: 'who wants to play 1 vs 1 today 3pm?'
  };

  return request(app)
      .post('/api/reviews/2000222/comments')
      .send(comment)
      .expect(404)
      .then(({ body: { msg }}) => {
          expect(msg).toBe('not found')
      });
});

describe("DELETE: /api/comments/:comment_id", () => {
  test("204: Should return a status of 204 and delete the comment at the specific comment_id", () => {
    return request(app)
      .delete("/api/comments/3")
      .expect(204)
      .then(() => {
        return db.query(`SELECT * FROM comments WHERE comment_id = 3`);
      })
      .then(({ rows }) => {
        expect(rows).toHaveLength(0);
      });
  });

  test('404: should return "not found" if comment does not exist', () => {
    return request(app)
      .delete("/api/comments/199999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });

  test('400: should return with "bad request" id comment_id is not a number', () => {
    return request(app)
      .delete("/api/comments/yo")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
});



});
