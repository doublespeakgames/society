import { Actor } from "@src/actor/types";
import { Ideology } from "@src/ideology/types";

export interface Society {
  ideology: Ideology;
  population: Actor[];
  toString: () => string;
}
