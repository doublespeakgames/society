import { Ideology } from "@src/ideology/types";

export interface Society {
  ideology: Ideology;
  toString: () => string;
}
