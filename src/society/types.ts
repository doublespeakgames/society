import { Action } from "@src/action/types";
import { ActorContext } from "@src/actor/types";

export interface Society extends Iterable<ActorContext> {
  processActions: (actions:Action[]) => void;
}
