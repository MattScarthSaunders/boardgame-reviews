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
            title: "Agricola",
            designer: "Uwe Rosenberg",
            review_body: expect.any(String),
            review_img_url: expect.any(String),
            votes: expect.any(Number),
            category: "euro game",
            owner: expect.any(String),
            created_at: expect.any(String),
          });
        });
    });
    test("GET 200 /api/reviews/:review_id/comments - should respond with array of comments for given review, sorted by date", () => {
      return request(app)
        .get("/api/reviews/3/comments")
        .expect(200)
        .then((res) => {
          expect(res.body.comments).toBeInstanceOf(Array);
          expect(res.body.comments).toHaveLength(3);
          expect(res.body.comments).toBeSortedBy("created_at", {
            descending: true,
          });
          res.body.comments.forEach((comment) => {
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
          expect(res.body.comments[0]).toEqual({
            comment_id: 6,
            body: "Not sure about dogs, but my cat likes to get involved with board games, the boxes are their particular favourite",
            votes: 10,
            author: "philippaclaire9",
            review_id: 3,
            created_at: "2021-03-27T19:49:48.110Z",
          });
        });
    });
    test("GET 200 - returns an empty array if no matches", () => {
      return request(app)
        .get("/api/reviews/7/comments")
        .expect(200)
        .then((res) => {
          expect(res.body.comments).toBeInstanceOf(Array);
          expect(res.body.comments).toHaveLength(0);
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
    test("GET 400 - invalid id for comment query", () => {
      return request(app)
        .get("/api/reviews/slippers/comments")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Invalid Id");
        });
    });
    test("GET 404 - returns no comment array and correct error message if id valid but out of bounds", () => {
      return request(app)
        .get("/api/reviews/9001/comments")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Content not found");
        });
    });
  });
});

describe("PATCH", () => {
  describe("functionality", () => {
    test("PATCH 200 - should update vote count of given review (positive)", () => {
      return request(app)
        .patch("/api/reviews/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then((res) => {
          expect(res.body.review.votes).toBe(2);
        });
    });
  });
  describe("Errors", () => {
    test("PATCH 400 - invalid review id", () => {
      return request(app)
        .patch("/api/reviews/spaniel")
        .send({ inc_votes: 1 })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Invalid Id");
        });
    });
    test("PATCH 404 - valid id but out of bounds", () => {
      return request(app)
        .patch("/api/reviews/9001")
        .send({ inc_votes: 1 })
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Content not found");
        });
    });
  });
});
