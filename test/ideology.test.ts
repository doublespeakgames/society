import { describe, it, expect } from "@jest/globals";
import Ideology from '@src/ideology'

describe("Ideology", () => {
  it("should be constructable with first principles", () => {
    const ideology = Ideology([
      { subject: 'people', is: 'sacred' },
      { subject: 'property', is: 'desired' },
      { subject: 'government', is: 'reviled' },
    ]);

    expect(ideology.judge('people')).toEqual([
      { value: 'sacred', reason: [{ subject: 'people', is: 'sacred' }] }
    ]);

    expect(ideology.judge('government')).toEqual([
      { value: 'reviled', reason: [{ subject: 'government', is: 'reviled' }] }
    ]);

    expect(ideology.judge('property')).toEqual([
      { value: 'desired', reason: [{ subject: 'property', is: 'desired' }] }
    ]);
  });

  it("should be able to infer beliefs", () => {
    const ideology = Ideology([
      { subject: { adjective: 'greedy', noun: 'people' }, is: 'criminal' },
      { subject: { adjective: 'criminal', noun: 'people' }, is: 'reviled' },
      { subject: 'people', is: 'greedy' },
    ]);

    expect(ideology.judge('people')).toEqual([
      { value: 'reviled', reason: [
        { subject: 'people', is: 'greedy' },
        { subject: { adjective: 'greedy', noun: 'people' }, is: 'criminal' },
        { subject: { adjective: 'criminal', noun: 'people' }, is: 'reviled' }
      ] }
    ]);
  });

  it("should allow values to stack", () => {
    const ideology = Ideology([
      { subject: { adjective: 'pretty', noun: 'flowers' }, is: 'desired' },
      { subject: 'flowers', is: "desired" },
      { subject: { adjective: 'pretty', noun: 'flowers' }, is: 'valuable' },
      { subject: { adjective: 'valuable', noun: 'flowers' }, is: 'desired' },
    ]);

    expect(ideology.judge('flowers')).toEqual([
      { value: 'desired', reason: [{ subject: 'flowers', is: 'desired' }] }
    ]);

    expect(ideology.judge({ adjective: 'pretty', noun: 'flowers' })).toEqual([
      { value: 'desired', reason: [
        { subject: 'flowers', is: 'desired' }
      ] },
      { value: 'desired', reason: [
        { subject: { adjective: 'pretty', noun: 'flowers' }, is: 'desired' }
      ] },
      { value: "desired", reason: [
        { subject: { adjective: "pretty", noun: "flowers" }, is: "valuable" },
        { subject: { adjective: "valuable", noun: "flowers" }, is: "desired" }
      ] }
    ]);

  })
});
