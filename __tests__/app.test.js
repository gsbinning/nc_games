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

//   describe("GET /api/reviews/:review_id", () => {
//     test("200: returns a review object", () => {
//       return request(app)
//         .get("/api/reviews/2")
//         .expect(200)
//         .then((res) => {
//         //console.log(res.body.review);
//         expect(res.body.review).toHaveLength(13);
//         res.body.review.forEach((review) => {
//           expect(res.body.review).toEqual(
//             expect.objectContaining({
//               owner: expect.any(String),
//               title: expect.any(String),
//               review_id: expect.any(Number),
//               review_body: expect.any(String),
//               designer: expect.any(String),
//               review_img_url: expect.any(String),
//               category: expect.any(String),
//               created_at: expect.any(String),
//               votes: expect.any(Number),
//             })
            
//           );
//         });
//     })
//     });



describe('GET /api/reviews/:review_id', () => {
    test("status 200: responds with a single review when passed review_id", () => {
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
  });


