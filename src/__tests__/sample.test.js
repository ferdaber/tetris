import { testFunction } from "src/helpers/sample";

test("foo", () => {
  expect(testFunction()).toBe("test!");
});
