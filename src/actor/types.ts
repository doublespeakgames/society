import { Adjective, Assertion, Ideology, Judgement, Noun } from "@src/ideology/types"

export interface ActorConfig {
  name?: string;
  principles?: Assertion[];
  attributes?: Adjective[];
  groups?: Noun[];
}

export interface Actor {
  name: string;
  ideology: Ideology;
  attributes: Set<Adjective>;
  groups: Set<Noun>;
  judge: (actor:Actor) => Judgement[];
  toString: () => string;
}
