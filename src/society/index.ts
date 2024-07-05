import { Assertion } from "@src/ideology/types";
import { Society } from "./types";
import IdeologyConstructor from "@src/ideology";
import ActorConstructor from "@src/actor";
import { arrayOf } from "@src/utils";

const SocietyConstructor = (principles:Assertion[], population:number):Society => {
  const actors = arrayOf(population, () => ActorConstructor({ principles }));
  return {
    ideology: IdeologyConstructor(principles),
    population: actors,
    toString: () => `
      Principles: ${JSON.stringify(principles, null, 2)}
      Actors: ${actors.map(a => a.toString()).join(', ')}
    `
  };
};

export default SocietyConstructor;
