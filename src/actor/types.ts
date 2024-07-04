import { Adjective, Ideology } from "@src/ideology/types"

export interface Actor {
  name: string;
  ideology: Ideology;
  attributes: Set<Adjective>;
  toString: () => string;
}
