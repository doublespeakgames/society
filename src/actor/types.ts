import { Action } from "@src/action/types";
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
  judge: (subject:Actor | Identity, doing?:Action) => Judgement[];
  toString: () => string;
}

export type Identity = Noun | CompoundNoun;

export interface Thought {
  subject: Identity;
  reason: Assertion[];
}

export interface Judgement {
  value: KeywordAdjective;
  reason: Assertion[];
}