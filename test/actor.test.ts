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
    const peopleAreSacred = { subject: 'people', is: 'sacred' };
    const famousPeopleAreLucky = { subject: { adjective: 'famous', noun: 'people' }, is: 'lucky' };
    const luckyPeopleAreReviled = { subject: { adjective: 'lucky', noun: 'people' }, is: 'reviled' };
    const unluckyPeopleAreFeared = { subject: { adjective: 'unlucky', noun: 'people' }, is: 'feared' };
    const principles = [
      peopleAreSacred,
      luckyPeopleAreReviled,
      unluckyPeopleAreFeared,
      famousPeopleAreLucky
    ];
    const society = SocietyConstructor(principles, 0);
    const famousPerson = Actor(society, [ 'famous' ]);
    const unluckyPerson = Actor(society, [ 'unlucky' ]);

    const judgement = famousPerson.judge(unluckyPerson);
    expect(judgement).toEqual([
      { value: 'sacred', reason: [ peopleAreSacred ] },
      { value: 'feared', reason: [ unluckyPeopleAreFeared ] },
    ]);

    const judgement2 = unluckyPerson.judge(famousPerson);
    expect(judgement2).toEqual([
      { value: 'sacred', reason: [ peopleAreSacred ] },
      { value: 'reviled', reason: [ famousPeopleAreLucky, luckyPeopleAreReviled ] },
    ]);
  });
});