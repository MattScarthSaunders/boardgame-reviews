const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
const db = require("../db/connection.js");
const endPointJsonData = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET", () => {
  describe("functionality", () => {
    test("GET 200: /api | should respond with a JSON file describing all endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual(endPointJsonData);
        });
    });
    test("GET 200: /api/categories | should respond with an array of category objects, with slug and description properties", () => {
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
    test("GET 200: /api/reviews | should respond with an array of review objects with correct props, sorted by date DESC, limited to 10 by default", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then((res) => {
          expect(res.body.reviews).toBeInstanceOf(Array);
          expect(res.body.reviews).toHaveLength(10);
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
    test("GET 200: /api/reviews?category= | should respond correctly with category query", () => {
      return request(app)
        .get("/api/reviews?category=dexterity")
        .expect(200)
        .then((res) => {
          expect(res.body.reviews).toBeInstanceOf(Array);
          expect(res.body.reviews).toHaveLength(1);
          expect(res.body.reviews).toBeSortedBy("created_at", {
            descending: true,
          });
          expect(res.body.reviews[0]).toEqual({
            review_id: 2,
            title: "Jenga",
            designer: "Leslie Scott",
            owner: "philippaclaire9",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_body: "Fiddly fun for all the family",
            category: "dexterity",
            created_at: expect.any(String),
            votes: 5,
            comment_count: 3,
          });
        });
    });
    test("GET 200: /api/reviews?category= | should respond with empty array if category exists but no reviews", () => {
      return request(app)
        .get("/api/reviews?category=children's%20games")
        .expect(200)
        .then((res) => {
          expect(res.body.reviews).toBeInstanceOf(Array);
          expect(res.body.reviews).toHaveLength(0);
        });
    });
    test("GET 200: /api/reviews?sort_by= | should respond correctly with sort_by query", () => {
      return request(app)
        .get("/api/reviews?sort_by=review_id")
        .expect(200)
        .then((res) => {
          expect(res.body.reviews).toBeInstanceOf(Array);
          expect(res.body.reviews).toHaveLength(10);
          expect(res.body.reviews).toBeSortedBy("review_id", {
            descending: true,
          });
          expect(res.body.reviews[0]).toEqual({
            review_id: 13,
            title: "Settlers of Catan: Don't Settle For Less",
            category: "social deduction",
            designer: "Klaus Teuber",
            owner: "mallionaire",
            review_body: expect.any(String),
            review_img_url: expect.any(String),
            created_at: "1970-01-10T02:08:38.400Z",
            votes: 16,
            comment_count: 0,
          });
        });
    });
    test("GET 200: /api/reviews?order= | should respond correctly with order query", () => {
      return request(app)
        .get("/api/reviews?order=asc")
        .expect(200)
        .then((res) => {
          expect(res.body.reviews).toBeInstanceOf(Array);
          expect(res.body.reviews).toHaveLength(10);
          expect(res.body.reviews).toBeSortedBy("created_at", {
            ascending: true,
          });
          expect(res.body.reviews[0]).toEqual({
            review_id: 13,
            title: "Settlers of Catan: Don't Settle For Less",
            category: "social deduction",
            designer: "Klaus Teuber",
            owner: "mallionaire",
            review_body: expect.any(String),
            review_img_url: expect.any(String),
            created_at: "1970-01-10T02:08:38.400Z",
            votes: 16,
            comment_count: 0,
          });
        });
    });
    test("GET 200: /api/reviews?category=&sort_by=&order= | should respond correctly with all queries", () => {
      return request(app)
        .get(
          "/api/reviews?category=social%20deduction&sort_by=review_id&order=asc"
        )
        .expect(200)
        .then((res) => {
          expect(res.body.reviews).toBeInstanceOf(Array);
          expect(res.body.reviews).toHaveLength(10);
          expect(res.body.reviews).toBeSortedBy("review_id", {
            ascending: true,
          });
          expect(res.body.reviews[0]).toEqual({
            review_id: 3,
            title: "Ultimate Werewolf",
            category: "social deduction",
            designer: "Akihisa Okui",
            owner: "bainesface",
            review_body: "We couldn't find the werewolf!",
            review_img_url: expect.any(String),
            created_at: "2021-01-18T10:01:41.251Z",
            votes: 5,
            comment_count: 3,
          });
        });
    });
    test("GET 200: /api/reviews?limit | should be able to set result limit", () => {
      return request(app)
        .get("/api/reviews?limit=12")
        .expect(200)
        .then((res) => {
          expect(res.body.reviews).toBeInstanceOf(Array);
          expect(res.body.reviews).toHaveLength(12);
        });
    });
    test("GET 200: /api/reviews?p | should be able to set start page (each page being the lenth of the limit)", () => {
      return request(app)
        .get("/api/reviews?p=1&limit=10&sort_by=review_id&order=asc")
        .expect(200)
        .then((res) => {
          expect(res.body.reviews).toBeInstanceOf(Array);
          expect(res.body.reviews).toHaveLength(3);
          expect(res.body.reviews[0].review_id).toBe(11);
        });
    });
    test("GET 200: /api/reviews | should return a total_count prop regardless of limits", () => {
      return request(app)
        .get("/api/reviews?limit=1")
        .expect(200)
        .then((res) => {
          expect(res.body.total_count).toBe(13);
        });
    });
    test("GET 200 /api/reviews/:review_id: | should respond with a single review object of correct ID", () => {
      return request(app)
        .get("/api/reviews/3")
        .expect(200)
        .then((res) => {
          expect(res.body.review).toEqual({
            review_id: 3,
            title: "Ultimate Werewolf",
            designer: "Akihisa Okui",
            review_body: expect.any(String),
            review_img_url: expect.any(String),
            votes: expect.any(Number),
            category: "social deduction",
            owner: expect.any(String),
            created_at: expect.any(String),
            comment_count: 3,
          });
        });
    });
    test("GET 200 /api/reviews/:review_id/comments | should respond with array of comments for given review, sorted by date", () => {
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
    test("GET 200 - /api/reviews/:review_id/comments | returns an empty array if no matches", () => {
      return request(app)
        .get("/api/reviews/7/comments")
        .expect(200)
        .then((res) => {
          expect(res.body.comments).toBeInstanceOf(Array);
          expect(res.body.comments).toHaveLength(0);
        });
    });
    test("GET 200 - /api/reviews/:review_id/comments?limit | limits displayed comments", () => {
      return request(app)
        .get("/api/reviews/2/comments?limit=2")
        .expect(200)
        .then((res) => {
          expect(res.body.comments).toBeInstanceOf(Array);
          expect(res.body.comments).toHaveLength(2);
        });
    });
    test("GET 200 - /api/reviews/:review_id/comments?p | offsets page of displayed comments", () => {
      return request(app)
        .get("/api/reviews/2/comments?p=1&limit=1")
        .expect(200)
        .then((res) => {
          expect(res.body.comments).toBeInstanceOf(Array);
          expect(res.body.comments).toHaveLength(1);
          expect(res.body.comments[0].created_at).toBe(
            "2017-11-22T12:43:33.389Z"
          );
        });
    });
    test("GET 200 - /api/users | returns an array of user objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((res) => {
          expect(res.body.users).toBeInstanceOf(Array);
          expect(res.body.users).toHaveLength(4);
          res.body.users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
            );
          });
        });
    });
    test("GET 200: /api/users/:username | should respond with a user object", () => {
      return request(app)
        .get("/api/users/mallionaire")
        .expect(200)
        .then((res) => {
          expect(res.body.user).toEqual({
            username: "mallionaire",
            name: "haz",
            avatar_url: expect.any(String),
          });
        });
    });
  });
  describe("Errors", () => {
    test("GET 400 - /api/reviews/:review_id | invalid review id", () => {
      return request(app)
        .get("/api/reviews/slippers")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Invalid Id or Query value");
        });
    });
    test("GET 404 - /api/reviews/:review_id | valid but out of bounds review id", () => {
      return request(app)
        .get("/api/reviews/9001")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("ID not found");
        });
    });
    test("GET 400 - /api/reviews/:review_id/comments |invalid id for comment query", () => {
      return request(app)
        .get("/api/reviews/slippers/comments")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Invalid Id or Query value");
        });
    });
    test("GET 404 - /api/reviews/:review_id/comments | returns no comment array and correct error message if id valid but out of bounds", () => {
      return request(app)
        .get("/api/reviews/9001/comments")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("reviews not found");
        });
    });
    test("GET 404 - /api/reviews?query | non existent category query", () => {
      return request(app)
        .get("/api/reviews?category=1")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("categories not found");
        });
    });
    test("GET 400 - /api/reviews?query | invalid sort query", () => {
      return request(app)
        .get("/api/reviews?sort_by=diplodocus")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Invalid Id or Query value");
        });
    });
    test("GET 400 - /api/reviews?query | invalid order", () => {
      return request(app)
        .get("/api/reviews?order=sideways")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Invalid Id or Query value");
        });
    });
    test("GET 400 - /api/reviews?query | query typo", () => {
      return request(app)
        .get("/api/reviews?older=desc")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad query");
        });
    });
    test("GET 400 - /api/reviews?query | invalid limit", () => {
      return request(app)
        .get("/api/reviews?limit=time")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Invalid Id or Query value");
        });
    });
    test("GET 400 - /api/reviews?query | invalid p", () => {
      return request(app)
        .get("/api/reviews?p=time")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Invalid Id or Query value");
        });
    });
    test("GET 400 - /api/reviews/:review_id/comments?query | invalid limit", () => {
      return request(app)
        .get("/api/reviews/2/comments?limit=time")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Invalid Id or Query value");
        });
    });
    test("GET 400 - /api/reviews/:review_id/comments?query | invalid limit", () => {
      return request(app)
        .get("/api/reviews/2/comments?p=time")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Invalid Id or Query value");
        });
    });
    test('"GET 404: /api/users/:username | username not found', () => {
      return request(app)
        .get("/api/users/patchesssss")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("User not found");
        });
    });
  });
});

describe("POST", () => {
  describe("functionality", () => {
    test("POST 201 - /api/reviews/:review_id/comments | can post a new comment to a review", () => {
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
    test("POST 201 - /api/reviews | can post a new review", () => {
      return request(app)
        .post("/api/reviews")
        .send({
          owner: "mallionaire",
          title: "Risk",
          review_body: "Colonial era military strategy on the tabletop!",
          designer: "Albert Lamorisse",
          category: "euro game",
        })
        .expect(201)
        .then((res) => {
          expect(res.body.review).toEqual({
            review_id: 14,
            owner: "mallionaire",
            title: "Risk",
            review_body: "Colonial era military strategy on the tabletop!",
            designer: "Albert Lamorisse",
            category: "euro game",
            votes: 0,
            created_at: expect.any(String),
            comment_count: 0,
          });
        });
    });
    test("POST 201 - /api/categories | can post new category", () => {
      return request(app)
        .post("/api/categories")
        .send({
          slug: "military strategy",
          description: "players simulate either tactical or strategic warfare",
        })
        .expect(201)
        .then((res) => {
          expect(res.body.category).toEqual({
            slug: "military strategy",
            description:
              "players simulate either tactical or strategic warfare",
          });
        });
    });
  });
  describe("errors", () => {
    test("POST 400 - /api/reviews/:review_id/comments | invalid review id", () => {
      return request(app)
        .post("/api/reviews/pippin/comments")
        .send({
          username: "mallionaire",
          body: "This boardgame is great, 10/10 would boardgame again.",
        })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Invalid Id or Query value");
        });
    });
    test("POST 404 - /api/reviews/:review_id/comments | valid id but out of bounds", () => {
      return request(app)
        .post("/api/reviews/9001/comments")
        .send({
          username: "mallionaire",
          body: "This boardgame is great, 10/10 would boardgame again.",
        })
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("reviews not found");
        });
    });
    test("POST 400 - /api/reviews/:review_id/comments | missing body", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({
          username: "mallionaire",
        })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Received invalid content");
        });
    });
    test("POST 400 - /api/reviews/:review_id/comments | missing username", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({
          body: "very insightful comment",
        })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Received invalid content");
        });
    });
    test("POST 400 - /api/reviews/:review_id/comments | bad username", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({
          userna1me: "mallionaire",
          body: "very insightful comment",
        })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Received invalid content");
        });
    });
    test("POST 400 - /api/reviews/:review_id/comments | bad body", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({
          username: "mallionaire",
          cbody: "very insightful comment",
        })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Received invalid content");
        });
    });
    test("POST 400 - /api/reviews | invalid body", () => {
      return request(app)
        .post("/api/reviews")
        .send({})
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Received invalid content");
        });
    });
    test("POST 400 - /api/reviews | missing body props", () => {
      return request(app)
        .post("/api/reviews")
        .send({
          owner: "mallionaire",
          title: "Risk",
          designer: "Albert Lamorisse",
          category: "euro game",
        })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Received invalid content");
        });
    });
    test("POST 400 - /api/reviews | body prop typos", () => {
      return request(app)
        .post("/api/reviews")
        .send({
          owner: "mallionaire",
          title: "Risk",
          reiew_ody: "military strategy game",
          designer: "Albert Lamorisse",
          category: "euro game",
        })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Received invalid content");
        });
    });
    test("POST 404 - /api/reviews | bad category content", () => {
      return request(app)
        .post("/api/reviews")
        .send({
          owner: "mallionaire",
          title: "Risk",
          review_body: "military strategy game",
          designer: "Albert Lamorisse",
          category: 123,
        })
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("categories not found");
        });
    });
    test("POST 404 - /api/reviews | bad owner content", () => {
      return request(app)
        .post("/api/reviews")
        .send({
          owner: "me",
          title: "Risk",
          review_body: "military strategy game",
          designer: "Albert Lamorisse",
          category: "dexterity",
        })
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("users not found");
        });
    });
    test("POST 400 - /api/reviews | no content on non-null prop", () => {
      return request(app)
        .post("/api/reviews")
        .send({
          owner: "mallionaire",
          title: null,
          review_body: "military strategy game",
          designer: "Albert Lamorisse",
          category: "dexterity",
        })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Received invalid content");
        });
    });
    test("POST 400 - /api/categories | no body", () => {
      return request(app)
        .post("/api/categories")
        .send({})
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Received invalid content");
        });
    });
    test("POST 400 - /api/categories | partial body", () => {
      return request(app)
        .post("/api/categories")
        .send({ description: "slugs" })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Received invalid content");
        });
    });
    test("POST 400 - /api/categories | partial body", () => {
      return request(app)
        .post("/api/categories")
        .send({ slug: "slugs" })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Received invalid content");
        });
    });
    test("POST 400 - /api/categories | prop typo", () => {
      return request(app)
        .post("/api/categories")
        .send({ slag: "unwanted debris", descriion: "rough, dangerous" })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Received invalid content");
        });
    });
  });
});

describe("PATCH", () => {
  describe("functionality", () => {
    test("PATCH 200 - /api/reviews/:review_id | should update vote count of given review (positive)", () => {
      return request(app)
        .patch("/api/reviews/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then((res) => {
          expect(res.body.review.votes).toBe(2);
        });
    });
    test("PATCH 200 - /api/reviews/:review_id | should handle negative values", () => {
      return request(app)
        .patch("/api/reviews/1")
        .send({ inc_votes: -100 })
        .expect(200)
        .then((res) => {
          expect(res.body.review.votes).toBe(-99);
        });
    });
    test("PATCH 200 - /api/comments/:comment_id | should update vote count of given comment", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 2 })
        .expect(200)
        .then((res) => {
          expect(res.body.comment.votes).toBe(18);
        });
    });
    test("PATCH 200 - /api/comments/:comment_id | should handle negatives", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: -2 })
        .expect(200)
        .then((res) => {
          expect(res.body.comment.votes).toBe(14);
        });
    });
  });
  describe("Errors", () => {
    test("PATCH 400 - /api/reviews/:review_id | invalid review id", () => {
      return request(app)
        .patch("/api/reviews/spaniel")
        .send({ inc_votes: 1 })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Invalid Id or Query value");
        });
    });
    test("PATCH 404 - /api/reviews/:review_id | valid id but out of bounds", () => {
      return request(app)
        .patch("/api/reviews/9001")
        .send({ inc_votes: 1 })
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("reviews not found");
        });
    });
    test("PATCH 400 - /api/reviews/:review_id | body missing", () => {
      return request(app)
        .patch("/api/reviews/1")
        .send({})
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Received invalid content");
        });
    });
    test("PATCH 400 - /api/reviews/:review_id | body prop typo", () => {
      return request(app)
        .patch("/api/reviews/1")
        .send({ inc_vetes: 1 })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Received invalid content");
        });
    });
    test("PATCH 400 - /api/reviews/:review_id | bad body prop value", () => {
      return request(app)
        .patch("/api/reviews/1")
        .send({ inc_vetes: "slime" })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Received invalid content");
        });
    });
  });
  test("PATCH 400 - /api/comments/:comment_id | invalid comment id", () => {
    return request(app)
      .patch("/api/comments/spaniel")
      .send({ inc_votes: 1 })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid Id or Query value");
      });
  });
  test("PATCH 404 - /api/comments/:comment_id | valid id but out of bounds", () => {
    return request(app)
      .patch("/api/comments/9001")
      .send({ inc_votes: 1 })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("comments not found");
      });
  });
  test("PATCH 400 - /api/comments/:comment_id | body missing", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({})
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Received invalid content");
      });
  });
  test("PATCH 400 - /api/comments/:comment_id | body prop typo", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_vetes: 1 })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Received invalid content");
      });
  });
  test("PATCH 400 - /api/comments/:comment_id | bad body prop value", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_vetes: "slime" })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Received invalid content");
      });
  });
});

describe("DELETE", () => {
  describe("functionality", () => {
    test("DELETE 204 - /api/comments/:comment_id | should delete given comment", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });
    test("DELETE 204 - /api/reviews/:review_id | should delete review", () => {
      return request(app).delete("/api/reviews/1").expect(204);
    });
  });
  describe("errors", () => {
    test("DELETE 400 - /api/comments/:comment_id | invalid id", () => {
      return request(app)
        .delete("/api/comments/samwise")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Invalid Id or Query value");
        });
    });
    test("DELETE 404 - /api/comments/:comment_id | valid id but out of bounds", () => {
      return request(app)
        .delete("/api/comments/9001")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("ID not found");
        });
    });
    test("DELETE 400 - /api/reviews/:review_id| invalid id", () => {
      return request(app)
        .delete("/api/reviews/samwise")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Invalid Id or Query value");
        });
    });
    test("DELETE 404 - /api/reviews/:review_id| valid id but out of bounds", () => {
      return request(app)
        .delete("/api/reviews/9001")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("ID not found");
        });
    });
  });
});

describe("Generic Errors", () => {
  test("route that does not exist", () => {
    return request(app)
      .get("/api/dinosa3ur2s")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid URL");
      });
  });
});
