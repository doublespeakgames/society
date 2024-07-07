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

export type ActorId = string;

export interface Actor {
  id: string;
  name: string;
  ideology: Ideology;
  identities: () => Identity[];
  judge: (context:JudgementContext) => Judgement[];
  toString: () => string;
}

export type Identity = Noun | CompoundNoun;

export interface Thought {
  subject: Identity;
  reason: Assertion[];
}

export interface Judgement {
  thing: Identity | Actor;
  values: ValueJudgement[];
}

export interface ValueJudgement {
  value: KeywordAdjective;
  reason: Assertion[];
}

export interface JudgementContext {
  things: Array<Identity | Actor>;
  actions?: Array<Action>;
}