import { Adjective, Assertion, Ideology, Judgement, Noun, Subject } from "@src/ideology/types"

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
