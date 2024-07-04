import { Assertion } from "@src/ideology/types";
import { Society } from "./types";
import IdeologyConstructor from "@src/ideology";
import ActorConstructor from "@src/actor";
import { Actor } from "@src/actor/types";

const SocietyConstructor = (principles:Assertion[], population:number):Society => {
  const society = {
    ideology: IdeologyConstructor(principles),
    toString: () => `
      Principles: ${JSON.stringify(principles, null, 2)}
      Actors: ${actors.map(a => a.toString()).join(', ')}
    `
  };
  const actors:Actor[] = Array.from({ length: population }, () => ActorConstructor(society));
  return society;
};

export default SocietyConstructor;
