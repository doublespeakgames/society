import { describe, it, expect } from "@jest/globals";
import Society from '@src/society'

describe("Society", () => {
  it("should be constructable", () => {
    const principles = [
      { subject: 'people', is: 'sacred' }
    ];

    const society = Society(principles, 10);

    expect(society.ideology.principles).toEqual(principles);
    expect(society.population.length).toBe(10);
    for (const actor of society.population) {
      expect(actor.ideology.principles).toEqual(principles);
    }
  });
});