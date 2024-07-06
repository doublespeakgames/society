import { describe, it, expect } from "@jest/globals";
import Actor from '@src/actor'
import { Assertion } from "@src/ideology/types";
import { judgementSort } from "./utils";

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

  it("should be able to infer beliefs", () => {
    const greedyPeopleAreCriminals = { subject: { adjective: 'greedy', noun: 'people' }, is: 'criminal' };
    const criminalPeopleAreReviled = { subject: { adjective: 'criminal', noun: 'people' }, is: 'reviled' };
    const peopleAreGreedy = { subject: 'people', is: 'greedy' };
    const actor = Actor({ principles: [
      greedyPeopleAreCriminals,
      criminalPeopleAreReviled,
      peopleAreGreedy,
    ]});

    expect(actor.judge(actor)).toEqual([
      { value: 'reviled', reason: [
        peopleAreGreedy,
        greedyPeopleAreCriminals,
        criminalPeopleAreReviled
      ] }
    ]);
  });

  it("should allow values to stack", () => {
    const peopleAreSacred = { subject: 'people', is: 'sacred' };
    const prettyPeopleAreValuable = { subject: { adjective: 'pretty', noun: 'people'}, is: 'valuable' };
    const valuablePeopleAreSacred = { subject: { adjective: 'valuable', noun: 'people' }, is: 'sacred' };
    const actor = Actor({ principles: [
      peopleAreSacred,
      prettyPeopleAreValuable,
      valuablePeopleAreSacred,
    ]});

    expect(actor.judge(Actor({}))).toEqual([
      { value: 'sacred', reason: [peopleAreSacred] }
    ]);

    expect(actor.judge(Actor({ attributes: ['pretty'] })).sort(judgementSort)).toEqual([
      { value: 'sacred', reason: [
        peopleAreSacred
      ] },
      { value: "sacred", reason: [
        prettyPeopleAreValuable,
        valuablePeopleAreSacred
      ] }
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
    expect(judgement.sort(judgementSort)).toEqual([
      { value: 'feared', reason: [ unluckyPeopleAreFeared ] },
      { value: 'sacred', reason: [ peopleAreSacred ] },
    ]);

    const judgement2 = unluckyPerson.judge(famousPerson);
    expect(judgement2.sort(judgementSort)).toEqual([
      { value: 'reviled', reason: [ famousPeopleAreLucky, luckyPeopleAreReviled ] },
      { value: 'sacred', reason: [ peopleAreSacred ] },
    ]);
  });

  it("should judge things based on group ideology", () => {
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

    const punkJudgement = punk.judge(hippie).sort(judgementSort);
    expect(punkJudgement).toEqual([
      { value: 'sacred', reason: [ peopleAreSacred ] },
      { value: 'trivial', reason: [ hippiesAreNaive, naivePeopleAreTrivial ] },
    ]);

    expect(hippie.judge(punk).sort(judgementSort)).toEqual([
      { value: 'feared', reason: [ punksAreViolent, violentPeopleAreFeared ] },
      { value: 'sacred', reason: [ peopleAreSacred ] },
    ]);
  });

  it("should judge actors based on their actions", () => {
    const peopleAreTrivial = { subject: 'people', is: 'trivial' };
    const smokingIsCool = { subject: { to: 'smoke' }, is: 'cool' };
    const coolPeopleAreDesired = { subject: { adjective: 'cool', noun: 'people' }, is: 'desired' };
    const principles = [ 
      smokingIsCool,
      coolPeopleAreDesired,
      peopleAreTrivial
    ];

    const actor = Actor({ principles });
    expect(actor.judge(actor)).toEqual([{
      value: 'trivial',
      reason: [ peopleAreTrivial ]
    }]);

    expect(actor.judge(actor, { verb: 'smoke' }).sort(judgementSort)).toEqual([
      { value: 'desired', reason: [ smokingIsCool, coolPeopleAreDesired ] },
      { value: 'trivial', reason: [ peopleAreTrivial ] }
    ]);
  });

  it("should judge actors based on their actions and group ideology", () => {
    const protestIsCool = { subject: { to: 'protest' }, is: 'cool' };
    const protestIsDangerous = { subject: { to: 'protest' }, is: 'dangerous' };
    const coolPeopleAreDesired = { subject: { adjective: 'cool', noun: 'people' }, is: 'desired' };
    const dangerousPeopleAreFeared = { subject: { adjective: 'dangerous', noun: 'people' }, is: 'feared' };
    const dangerousPeopleAreReviled = { subject: { adjective: 'dangerous', noun: 'people' }, is: 'reviled' };
    const punkBeliefs = { group: 'punks', believe: [protestIsCool] };
    const bootlickerBeliefs = { group: 'bootlickers', believe: [protestIsDangerous, dangerousPeopleAreReviled] };
    const principles = [ 
      coolPeopleAreDesired,
      dangerousPeopleAreFeared,
      punkBeliefs,
      bootlickerBeliefs
    ];

    const citizen = Actor({ principles });
    const punk = Actor({ principles, groups: [ 'punks' ] });
    const bootlicker = Actor({ principles, groups: [ 'bootlickers' ] });

    expect(citizen.judge(punk)).toEqual([]);
    expect(citizen.judge(punk, { verb: 'protest' })).toEqual([]);
    expect(punk.judge(citizen)).toEqual([]);
    expect(punk.judge(citizen, { verb: 'protest' })).toEqual([
      { value: 'desired', reason: [ protestIsCool, coolPeopleAreDesired ] }
    ]);
    expect(bootlicker.judge(citizen)).toEqual([]);
    expect(bootlicker.judge(citizen, { verb: 'protest' })).toEqual([
      { value: 'feared', reason: [protestIsDangerous, dangerousPeopleAreFeared] },
      { value: 'reviled', reason: [protestIsDangerous, dangerousPeopleAreReviled] }
    ]);
  });
});