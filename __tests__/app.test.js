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
        //console.log(res.body.categories[0]);
        expect(Array.isArray(res.body.categories)).toBe(true);
        expect(res.body.categories).toHaveLength(4);
        expect(Object.keys(res.body.categories[0])).toEqual(["slug", "description"])
      })
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



describe('GET /api/reviews/:review_id', () => {
    test("200: responds with a single review when passed review_id", () => {
      return request(app)
        .get('/api/reviews/1')
        .expect(200)
        .then(({ body }) => {
         // console.log(body.review, "test");
          expect(body.review).toBeInstanceOf(Object);
          expect(body.review).toEqual(expect.objectContaining({
            review_id: 1,
            title: 'Agricola',
            review_body: 'Farmyard fun!',
            designer: 'Uwe Rosenberg',
            review_img_url:
              'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
            votes: 1,
            category: 'euro game',
            owner: 'mallionaire',
            created_at: '2021-01-18T10:00:20.514Z'
          }));
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
        const review_id = 1
        return request(app)
          .get(`/api/reviews/${review_id}`)
          .expect(200)
          .then(({ body }) => {
            //console.log(body.review);
          expect(body.review).toEqual(
            expect.objectContaining({
            comment_count: 0
                        })
                    );
               });
           
});



    describe('PATCH /api/reviews/:review_id', () => {
        test('200:return the updated vote in the response body', () => {
          const reqBody = { inc_votes: 100 };
          return request(app)
            .patch('/api/reviews/1')
            .send(reqBody)
            .expect(200)
            .then(({ body }) => {
                //console.log(body);
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
                  //console.log(res.body.review);
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

        test('404: when provided with a valid but non-existent review id', () => {
            const reqBody = { inc_votes: 1 };
            return request(app)
              .get('/api/reviews/1000')
              .send(reqBody)
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).toBe('not found');
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
          test('400: returns when vote is not a number', () => {
            return request(app)
              .patch("/api/reviews/6")
              .send({ inc_votes: "doggy" })
              .expect(400)
              .then((res) => {
                expect(res.body.msg).toBe("bad request")
              })
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
        })
         });
       });
    });


    describe('GET /api/reviews', () => {
        test('200: should return all reviews', () => {
          return request(app)
            .get('/api/reviews')
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
              })
            })
        });
      });

