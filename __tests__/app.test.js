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
      } 
        )
        
      });
  });
  test("404: Not Found categories", () => {
    return request(app)
      .get("/api/cetegories")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not Found!");
      });
  });
//});

