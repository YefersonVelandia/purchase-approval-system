import { handler } from "./index";

describe("Health Lambda", () => {
  it("should return status 200", async () => {
    const response = await handler();

    expect(response.statusCode).toBe(200);
  });
});
