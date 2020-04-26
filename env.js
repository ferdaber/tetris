const dev =
  process.env.NODE_ENV == null ||
  process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV === "test";
module.exports = dev;
