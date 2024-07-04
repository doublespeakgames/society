import { Adjective, Ideology, Judgement, Noun } from "@src/ideology/types"

export interface Actor {
  name: string;
  ideology: Ideology;
  attributes: Set<Adjective>;
  groups: Set<Noun>;
  judge: (actor:Actor) => Judgement[];
  toString: () => string;
}
