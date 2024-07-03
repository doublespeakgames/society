import { describe, it, expect } from "@jest/globals";
import { is } from "@src/statement";

describe("Assignment", () => {
  it("should assign a keyword adjective to a keyword noun", () => {
    is({
      subject: 'people',
      is: 'desired'
    });

    // TODO
    expect(true).toBe(true);
  });
});
