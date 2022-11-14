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
    test("GET 200: should respond with an array of review objects with correct props, sorted by date DESC", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then((res) => {
          expect(res.body.reviews).toBeInstanceOf(Array);
          expect(res.body.reviews).toHaveLength(13);
          expect(res.body.reviews).toBeSortedBy("created_at", {
            descending: true,
          });
          res.body.reviews.forEach((review) => {
            expect(review).toEqual(
              expect.objectContaining({
                review_id: expect.any(Number),
                owner: expect.any(String),
                title: expect.any(String),
                category: expect.any(String),
                review_img_url: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                designer: expect.any(String),
                comment_count: expect.any(Number),
              })
            );
          });
        });
    });
  });

  //covers /categories and /reviews GETs, as well as any route typo.
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
