import { Action } from "@src/action/types";
import { Society } from "./types";
import { Actor } from "@src/actor/types";

export const GlobalSociety = (actors:Actor[]):Society => {
  let things:Actor[] = actors ?? [];
  let actions:Action[] = [];
  const iterator = function* () {
    yield { things, actions };
  };
  const processActions = (newActions:Action[]) => actions = newActions;
  return {
    [Symbol.iterator]: iterator,
    processActions
  };
};

export const runSociety = (society:Society):Action[] => [...society]
  .flatMap(actorContext => {
    const actors = actorContext.things
      .filter(thing => typeof thing === 'object' && 'judge' in thing);
    return actors
      .flatMap(actor => actor.act(actorContext))
      .filter(Boolean) as Action[];
  });
