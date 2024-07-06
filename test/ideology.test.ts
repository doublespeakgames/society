import { describe, it, expect } from "@jest/globals";
import Ideology from '@src/ideology'

describe("Ideology", () => {
  it("should be constructable with first principles", () => {
    const peopleAreSacred = { subject: 'people', is: 'sacred' };
    const propertyIsDesired = { subject: 'property', is: 'desired' };
    const governmentIsFeared = { subject: 'government', is: 'feared' };

    const ideology = Ideology([
      peopleAreSacred,
      propertyIsDesired,
      governmentIsFeared,
    ]);

    expect(ideology.judge('people')).toEqual(['sacred']);
    expect(ideology.judge('government')).toEqual(['feared']);
    expect(ideology.judge('property')).toEqual(['desired']);
  });

  it("should differentiate ideology across groups", () => {
    const propertyIsSacred = { subject: 'property', is: 'sacred' };
    const governmentIsReviled = { subject: 'government', is: 'reviled' };
    const propertyIsTrivial = { subject: 'property', is: 'trivial' };
    const governmentIsDesired = { subject: 'government', is: 'desired' };
    const ideology = Ideology([
      { group: 'capitalists', believe: [
        propertyIsSacred,
        governmentIsReviled,
      ] },
      { group: 'socialists', believe: [
        propertyIsTrivial,
        governmentIsDesired,
      ] }
    ]);

    expect(ideology.judge('property', 'socialists')).toEqual(['trivial']);
    expect(ideology.judge('property', 'capitalists')).toEqual(['sacred']);
    expect(ideology.judge('government', 'socialists')).toEqual(['desired']);
    expect(ideology.judge('government', 'capitalists')).toEqual(['reviled']);
  });

  it("should be able to judge infinitives", () => {
    const ideology = Ideology([
      { subject: { to: 'love' }, is: 'sacred' },
      { subject: { to: 'hate' }, is: 'reviled' },
      { subject: { to: 'be' }, is: 'trivial' }
    ]);

    expect(ideology.judge({ to: 'love' })).toEqual(['sacred']);
    expect(ideology.judge({ to: 'hate' })).toEqual(['reviled']);
    expect(ideology.judge({ to: 'be' })).toEqual(['trivial']);
  });
});
