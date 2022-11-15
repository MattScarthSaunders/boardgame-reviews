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
    test("GET 400 - invalid review id", () => {
      return request(app)
        .get("/api/reviews/slippers")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Invalid Id");
        });
    });
    test("GET 404 - valid but out of bounds review id", () => {
      return request(app)
        .get("/api/reviews/9001")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("ID not found");
        });
    });
  });
});

describe("POST", () => {
  describe("functionality", () => {
    test("POST 201 - can post a new comment to a review", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({
          username: "mallionaire",
          body: "This boardgame is great, 10/10 would boardgame again.",
        })
        .expect(201)
        .then((res) => {
          expect(res.body.comment).toEqual({
            username: "mallionaire",
            body: "This boardgame is great, 10/10 would boardgame again.",
          });
        });
    });
  });
  describe("errors", () => {});
});
