import { describe, it, expect } from "@jest/globals";
import Actor from '@src/actor'
import SocietyConstructor from "@src/society";

describe("Actor", () => {
  it("should be constructable", () => {
    const principles = [
      { subject: 'people', is: 'sacred' }
    ];
    const society = SocietyConstructor(principles, 0);

    const attributes = [ 'lucky' ];
    const actor = Actor(society, attributes);

    expect(actor.name).toBeTruthy();
    expect(actor.ideology).toBeTruthy();
    expect(actor.attributes.size).toBe(attributes.length);
    for (const attr of attributes) {
      expect(actor.attributes.has(attr)).toBeTruthy();
    }
  });

  it("should be able to judge other actors", () => {
    const principles = [
      { subject: 'people', is: 'sacred' },
      { subject: { adjective: 'lucky', noun: 'people' }, is: 'reviled' },
      { subject: { adjective: 'unlucky', noun: 'people' }, is: 'feared' }
    ];
    const society = SocietyConstructor(principles, 0);

    const attributes = [ 'lucky' ];
    const actor = Actor(society, attributes);

    const otherAttributes = [ 'unlucky' ];
    const otherActor = Actor(society, otherAttributes);

    const judgement = actor.judge(otherActor);
    console.log(judgement);
    expect(judgement).toEqual([
      { value: 'feared', reason: [] },
    ]);
  });
});