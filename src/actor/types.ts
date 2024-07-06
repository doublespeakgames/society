import {
  Adjective,
  Assertion,
  CompoundNoun,
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
  identities: () => Identity[];
  judge: (actor:Actor) => Judgement[];
  toString: () => string;
}

export type Identity = Noun | CompoundNoun;

export interface Thought<S> {
  subject: S;
  reason: SimpleAssertion[];
}

export interface Judgement {
  value: KeywordAdjective;
  reason: SimpleAssertion[];
}