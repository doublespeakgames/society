import { describe, it, expect } from "@jest/globals";
import Actor from '@src/actor'
import { Assertion } from "@src/ideology/types";

describe("Actor", () => {
  it("should be constructable", () => {
    const principles = [
      { subject: 'people', is: 'sacred' }
    ];

    const attributes = [ 'lucky' ];
    const actor = Actor({ principles, attributes });

    expect(actor.name).toBeTruthy();
    expect(actor.ideology).toBeTruthy();
    expect(actor.identities()).toEqual([
      'people',
      { adjective: 'lucky', noun: 'people' }
    ]);
  });

  it("should be able to have group identity", () => {
    const groups = [ 'hackers', 'punks' ];
    const attribute = 'chaotic';
    const actor = Actor({ groups, attributes: [ attribute ] });
    expect(actor.identities()).toEqual([
      'people',
      ...groups,
      { adjective: attribute, noun: 'people' },
      ...groups.map(group => ({ adjective: attribute, noun: group }))
    ]);
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
    const famousPerson = Actor({ principles, attributes: [ 'famous' ] });
    const unluckyPerson = Actor({ principles, attributes: [ 'unlucky' ] });

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

  it("should judge things based on its group ideology", () => {
    const peopleAreSacred = { subject: 'people', is: 'sacred' };
    const violentPeopleAreFeared = { subject: { adjective: 'violent', noun: 'people' }, is: 'feared' };
    const naivePeopleAreTrivial = { subject: { adjective: 'naive', noun: 'people' }, is: 'trivial' };
    const punksAreViolent = { subject: 'punks', is: 'violent' };
    const hippiesAreNaive = { subject: 'hippies', is: 'naive' };
    const punksBelieve = { group: 'punks', believe: [hippiesAreNaive]};
    const hippiesBelieve = { group: 'hippies', believe: [punksAreViolent]};
    const principles:Assertion[] = [
      peopleAreSacred,
      violentPeopleAreFeared,
      naivePeopleAreTrivial,
      punksBelieve,
      hippiesBelieve
    ];
    const punk = Actor({ principles, groups: [ 'punks' ] });
    const hippie = Actor({ principles, groups: [ 'hippies' ] });

    expect(punk.judge(hippie)).toEqual([
      { value: 'sacred', reason: [ peopleAreSacred ] },
      { value: 'trivial', reason: [ hippiesAreNaive, naivePeopleAreTrivial ] },
    ]);

    expect(hippie.judge(punk)).toEqual([
      { value: 'sacred', reason: [ peopleAreSacred ] },
      { value: 'feared', reason: [ punksAreViolent, violentPeopleAreFeared ] },
    ]);
  });
});