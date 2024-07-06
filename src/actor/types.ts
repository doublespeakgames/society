import {
  Adjective,
  Assertion,
  Ideology,
  KeywordAdjective,
  Noun,
  SimpleAssertion,
  Subject
} from "@src/ideology/types"

export interface ActorConfig {
  name?: string;
  principles?: Assertion[];
  attributes?: Adjective[];
  groups?: Noun[];
}

export interface Actor {
  name: string;
  ideology: Ideology;
  identities: () => Subject[];
  judge: (actor:Actor) => Judgement[];
  toString: () => string;
}

export interface Thought {
  subject: Subject;
  reason: SimpleAssertion[];
}

export interface Judgement {
  value: KeywordAdjective;
  reason: SimpleAssertion[];
}