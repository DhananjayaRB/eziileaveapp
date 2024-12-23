import jwt from "jsonwebtoken";

beforeAll(async () => {
  process.env.JWT_KEY = "asdf";
});
