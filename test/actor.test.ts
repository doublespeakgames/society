import { describe, it, expect } from "@jest/globals";
import Actor from '@src/actor'
import { Assertion } from "@src/ideology/types";
import { sortJudgements } from "./utils";

describe("Actor", () => {
  it("should be constructable", () => {
    const principles = [
      { subject: 'people', is: 'sacred' }
    ];

    const attributes = [ 'lucky' ];
    const actor = Actor({ principles, attributes });

    expect(actor.id).toBeTruthy();
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

  it("should be able to judge non-actor things", () => {
    const flowersAreSacred = { subject: 'flowers', is: 'sacred' };
    const prettyFlowersAreDesired = { subject: { adjective: 'pretty', noun: 'flowers' }, is: 'desired' };
    const actor = Actor({ principles: [
      flowersAreSacred,
      prettyFlowersAreDesired
    ]});
    expect(actor.judge({ things: ['flowers'] })).toEqual([{
      thing: 'flowers',
      values: [{ value: 'sacred', reason: [ flowersAreSacred ] }]
    }]);
    expect(sortJudgements(actor.judge({ things: [{ adjective: 'pretty', noun: 'flowers' }] }))).toEqual([{
      thing: { adjective: 'pretty', noun: 'flowers' },
      values: [
        { value: 'desired', reason: [ prettyFlowersAreDesired ] },
        { value: 'sacred', reason: [ flowersAreSacred ] }
      ]
    }]);
  });

  it("should be able to judge multiple things", () => {
    const informationIsDesired = { subject: 'information', is: 'desired' };
    const lawsAreTrivial = { subject: 'laws', is: 'trivial' };
    const corporationsAreReviled = { subject: 'corporations', is: 'reviled' };
    const hacker = Actor({ principles: [
      informationIsDesired,
      lawsAreTrivial,
      corporationsAreReviled
    ]});
    expect(hacker.judge({ things: ['information', 'laws', 'corporations'] })).toEqual([
      { thing: 'information', values: [{ value: 'desired', reason: [ informationIsDesired ] }] },
      { thing: 'laws', values: [{ value: 'trivial', reason: [ lawsAreTrivial ] }] },
      { thing: 'corporations', values: [{ value: 'reviled', reason: [ corporationsAreReviled ] }] }
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

    const judgement = actor.judge({ things: [actor] });
    expect(judgement).toEqual([{
      thing: actor,
      values: [{ value: 'reviled', reason: [
        peopleAreGreedy,
        greedyPeopleAreCriminals,
        criminalPeopleAreReviled
      ] }]
    }]);
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

    expect(actor.judge({ things: [actor] })).toEqual([{
      thing: actor,
      values: [{ value: 'sacred', reason: [peopleAreSacred] }]
    }]);

    const prettyActor = Actor({ attributes: ['pretty'] });
    expect(sortJudgements(actor.judge({ things: [prettyActor] }))).toEqual([{
      thing: prettyActor,
      values: [
        { value: 'sacred', reason: [peopleAreSacred] },
        { value: "sacred", reason: [prettyPeopleAreValuable, valuablePeopleAreSacred] }
      ]
    }]);
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

    const judgement = famousPerson.judge({ things: [unluckyPerson] });
    expect(sortJudgements(judgement)).toEqual([{
      thing: unluckyPerson,
      values: [
        { value: 'feared', reason: [ unluckyPeopleAreFeared ] },
        { value: 'sacred', reason: [ peopleAreSacred ] },
      ]
    }]);

    const judgement2 = unluckyPerson.judge({ things: [famousPerson] });
    expect(sortJudgements(judgement2)).toEqual([{
      thing: famousPerson,
      values: [
        { value: 'reviled', reason: [ famousPeopleAreLucky, luckyPeopleAreReviled ] },
        { value: 'sacred', reason: [ peopleAreSacred ] },
      ]
    }]);
  });

  it("should judge things based on group ideology", () => {
    const peopleAreSacred = { subject: 'people', is: 'sacred' };
    const violentPeopleAreFeared = { subject: { adjective: 'violent', noun: 'people' }, is: 'feared' };
    const naivePeopleAreTrivial = { subject: { adjective: 'naive', noun: 'people' }, is: 'trivial' };
    const punksAreViolent = { subject: 'punks', is: 'violent' };
    const hippiesAreNaive = { subject: 'hippies', is: 'naive' };
    const punksThinkHippiesAreNaive = { group: 'punks', believe: hippiesAreNaive};
    const hippiesThinkPunksAreViolent = { group: 'hippies', believe: punksAreViolent};
    const principles:Assertion[] = [
      peopleAreSacred,
      violentPeopleAreFeared,
      naivePeopleAreTrivial,
      punksThinkHippiesAreNaive,
      hippiesThinkPunksAreViolent
    ];
    const punk = Actor({ principles, groups: [ 'punks' ] });
    const hippie = Actor({ principles, groups: [ 'hippies' ] });

    const punkJudgement = punk.judge({ things: [hippie] });
    expect(sortJudgements(punkJudgement)).toEqual([{
      thing: hippie,
      values: [
        { value: 'sacred', reason: [ peopleAreSacred ] },
        { value: 'trivial', reason: [ punksThinkHippiesAreNaive, naivePeopleAreTrivial ] },
      ]
    }]);

    expect(sortJudgements(hippie.judge({ things: [punk] }))).toEqual([{
      thing: punk,
      values: [
        { value: 'feared', reason: [ hippiesThinkPunksAreViolent, violentPeopleAreFeared ] },
        { value: 'sacred', reason: [ peopleAreSacred ] },
      ]
    }]);
  });

  it("should judge actors for their group membership", () => {
    const punksAreFeared = { subject: 'punks', is: 'feared' };
    const actor = Actor({ principles: [ punksAreFeared ]});
    const punk = Actor({ groups: [ 'punks' ] });
    expect(actor.judge({ things: [punk] })).toEqual([
      { thing: punk, values: [{ value: 'feared', reason: [ punksAreFeared ] }] }
    ]);
  })

  it("should merge beliefs when belonging to multiple groups", () => {
    const metalIsSacred = { subject: 'metal', is: 'sacred' };
    const punkrockIsTrivial = { subject: 'punkrock', is: 'trivial' };
    const metalheadsThinkMetalIsSacred = { group: 'metalheads', believe: metalIsSacred };
    const punksThinkPunkrockIsTrivial = { group: 'punks', believe: punkrockIsTrivial };
    const principles = [ metalheadsThinkMetalIsSacred, punksThinkPunkrockIsTrivial ];
    
    const rocker = Actor({ principles, groups: [ 'metalheads', 'punks' ]});

    expect(rocker.judge({ things: ['metal'] })).toEqual([{
      thing: 'metal',
      values: [{ value: 'sacred', reason: [ metalheadsThinkMetalIsSacred ] }]
    }]);
    expect(rocker.judge({ things: ['punkrock'] })).toEqual([{
      thing: 'punkrock',
      values: [{ value: 'trivial', reason: [ punksThinkPunkrockIsTrivial ] }]
    }]);
  });

  it("should judge actors based on their actions", () => {
    const peopleAreTrivial = { subject: 'people', is: 'trivial' };
    const smokingIsCool = { subject: { to: 'smoke' }, is: 'cool' };
    const smokingIsFeared = { subject: { to: 'smoke' }, is: 'feared' }
    const coolPeopleAreDesired = { subject: { adjective: 'cool', noun: 'people' }, is: 'desired' };
    const principles = [ 
      smokingIsFeared,
      smokingIsCool,
      coolPeopleAreDesired,
      peopleAreTrivial
    ];

    const actor = Actor({ principles });
    const smoker = Actor({});
    const nonsmoker = Actor({});
    expect(actor.judge({ things: [smoker, nonsmoker] })).toEqual([{
      thing: smoker,
      values: [{ value: 'trivial', reason: [ peopleAreTrivial ] }]
    }, {
      thing: nonsmoker,
      values: [{ value: 'trivial', reason: [ peopleAreTrivial ] }]
    }]);

    expect(sortJudgements(actor.judge({
      things: [smoker, nonsmoker],
      actions: [{ subject: smoker, verb: 'smoke' }]
    }))).toEqual([{
      thing: smoker,
      values: [
        { value: 'desired', reason: [ smokingIsCool, coolPeopleAreDesired ] },
        { value: 'feared', reason: [ smokingIsFeared ] },
        { value: 'trivial', reason: [ peopleAreTrivial ] }
      ]
    }, {
      thing: nonsmoker,
      values: [
        { value: 'trivial', reason: [ peopleAreTrivial ] }
      ]
    }]);
  });

  it("should judge actors based on their actions and group ideology", () => {
    const protestIsCool = { subject: { to: 'protest' }, is: 'cool' };
    const protestIsDangerous = { subject: { to: 'protest' }, is: 'dangerous' };
    const coolPeopleAreDesired = { subject: { adjective: 'cool', noun: 'people' }, is: 'desired' };
    const dangerousPeopleAreFeared = { subject: { adjective: 'dangerous', noun: 'people' }, is: 'feared' };
    const dangerousPeopleAreReviled = { subject: { adjective: 'dangerous', noun: 'people' }, is: 'reviled' };
    const punksThinkProtestIsCool = { group: 'punks', believe: protestIsCool };
    const bootlickerBeliefs = { group: 'bootlickers', believe: [protestIsDangerous, dangerousPeopleAreReviled] };
    const principles = [ 
      coolPeopleAreDesired,
      dangerousPeopleAreFeared,
      punksThinkProtestIsCool,
      bootlickerBeliefs
    ];

    const citizen = Actor({ principles });
    const punk = Actor({ principles, groups: [ 'punks' ] });
    const bootlicker = Actor({ principles, groups: [ 'bootlickers' ] });

    expect(citizen.judge({ things: [punk] })).toEqual([{ thing: punk, values: [] }]);
    expect(citizen.judge({ 
      things: [punk], 
      actions: [{ subject: punk, verb: 'protest' }]
    })).toEqual([{ thing: punk, values: [] }]);
    expect(punk.judge({ things: [citizen] })).toEqual([{ thing: citizen, values: [] }]);
    expect(punk.judge({
      things: [citizen], 
      actions: [{ subject: citizen, verb: 'protest' }]
    })).toEqual([{
      thing: citizen,
      values: [{ value: 'desired', reason: [ punksThinkProtestIsCool, coolPeopleAreDesired ] }]
    }]);
    expect(bootlicker.judge({ things: [citizen] })).toEqual([{ thing: citizen, values: [] }]);
    expect(bootlicker.judge({
      things: [citizen],
      actions: [{ subject: citizen, verb: 'protest' }]
    })).toEqual([{
      thing: citizen,
      values: [
        { value: 'feared', reason: [{ group: 'bootlickers', believe: protestIsDangerous }, dangerousPeopleAreFeared] },
        { value: 'reviled', reason: [
          { group: 'bootlickers', believe: protestIsDangerous }, 
          { group: 'bootlickers', believe: dangerousPeopleAreReviled }
        ] }
      ]
    }]);
  });

  it("should express emotion", () => {
    const octopusesAreSacred = { subject: 'octopus', is: 'sacred' };
    const actor = Actor({ principles: [ octopusesAreSacred ] });
    const context = { things: ['octopus'] };
    expect(actor.act(context)).toEqual({
      verb: 'protect', 
      subject: actor,
      object: 'octopus',
      withEmotion: 'sacred'
    });
  });
});
