import { VALUES } from "../constants";

export type KeywordVerb = "take" | "give";
export type KeywordNoun = "people";
export type KeywordAdjective = typeof VALUES[number];
export type Noun = KeywordNoun | string;
export type Verb = KeywordVerb | string;
export type Adjective = KeywordAdjective | string;
export type CompoundNoun = {
  adjective: Adjective;
  noun: Noun;
}
// Add more Subject types here
export type Subject = Noun | CompoundNoun;
export interface Action {
  subject: Subject;
  object?: Noun;
  verb: Verb;
}

export interface Assertion {
  subject: Subject;
  is: Noun | Adjective;
}

// Add more statement types here
export type Statement = Assertion;

export interface Judgement {
  value: KeywordAdjective;
  reason: Assertion[];
}

export interface Ideology {
  assert: (statement:Assertion) => void;
  judge: (subjectOrSubjects:Subject|Subject[]) => Judgement[];
  principles: Assertion[];
  toString: () => string;
}

export interface ResolveTask {
  subject: Subject;
  reason: Assertion[];
}
