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
          //console.log(body.review);
          expect(body.review).toBeInstanceOf(Object);
          expect(body.review).toEqual({
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
          });
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



    describe('PATCH /api/reviews/:review_id', () => {
        test('200:return the updated vote in the response body', () => {
          const incrementedVoteObj = { inc_votes: 100 };
          return request(app)
            .patch('/api/reviews/1')
            .send(incrementedVoteObj)
            .expect(200)
            .then(({ body }) => {
                console.log(body);
              expect(body.review.review_id).toBe(1);
              expect(body.review.votes).toBe(101);
            });  
        });

        test("200: returns returns updated review object when new votes is a negative number", () => {
            const newReqBody = { inc_votes: -2 };
            return request(app)
              .patch("/api/reviews/2")
              .send(newReqBody)
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

        test('404: when provided with a valid but non-existent review id', () => {
            const newVoteObj = { inc_votes: 1 };
            return request(app)
              .get('/api/reviews/1000')
              .send(newVoteObj)
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
            const newReqBody = { inc_votes: "5.5" };
        
            return request(app)
              .patch("/api/reviews/1")
              .send(newReqBody)
              .expect(400)
              .then((res) => {
                expect(res.body.msg).toBe("bad request");
              });
          });
        });
     });
    //});
//});