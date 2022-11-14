const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
const db = require("../db/connection.js");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET", () => {
  describe("functionality", () => {
    test("GET 200: should respond with an array of category objects, with slug and description properties", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then((res) => {
          expect(res.body.categories).toBeInstanceOf(Array);
          expect(res.body.categories).toHaveLength(4);
          res.body.categories.forEach((category) => {
            expect(category).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
    test("GET 200 /api/reviews/:review_id: should respond with a single review object of correct ID", () => {
      return request(app)
        .get("/api/reviews/1")
        .expect(200)
        .then((res) => {
          expect(res.body.review).toEqual({
            review_id: 1,
            title: expect.any(String),
            review_body: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            votes: expect.any(Number),
            category: expect.any(String),
            owner: expect.any(String),
            created_at: expect.any(String),
          });
        });
    });
  });
  describe("Errors", () => {
    test("GET 404 - route that does not exist", () => {
      return request(app)
        .get("/api/dinosa3ur2s")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Invalid URL");
        });
    });
  });
});
