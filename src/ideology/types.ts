import { VALUES, VERBS } from "../constants";

export type KeywordNoun = "people";
export type KeywordVerb = typeof VERBS[number];
export type KeywordAdjective = typeof VALUES[number];
export type Noun = KeywordNoun | string;
export type Verb = KeywordVerb | string;
export type Adjective = KeywordAdjective | string;
export type CompoundNoun = {
  adjective: Adjective;
  noun: Noun;
}
export type Infinitive = { to: Verb };

// Add more Subject types here
export type Subject = Noun | CompoundNoun | Infinitive;
export type SubjectHash = string;

export interface SimpleAssertion {
  subject: Subject;
  is: Noun | Adjective;
}

export interface GroupAssertion {
  group: Noun;
  believe: SimpleAssertion | SimpleAssertion[];
}

// Add more assertion types here
export type Assertion = SimpleAssertion | GroupAssertion;

export interface Ideology {
  assert: (assertion:Assertion) => void;
  judge: (subject:Subject, group?:Noun) => Adjective[];
  principles: Assertion[];
  toString: () => string;
}

export interface ResolveTask {
  subject: Subject;
  reason: SimpleAssertion[];
}
