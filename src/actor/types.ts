import { Action } from "@src/action/types";
import {
  Adjective,
  Assertion,
  CompoundNoun,
  Ideology,
  KeywordAdjective,
  Noun,
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
  judge: (context:ActorContext) => Judgement[];
  act: (context:ActorContext) => Action | null;
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

export interface ActorContext {
  things: Array<Identity | Actor>;
  actions?: Array<Action>;
}

export interface Feeling {
  subject: Identity | Actor;
  value: KeywordAdjective;
  strength: number;
}
