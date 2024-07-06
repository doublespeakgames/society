import { Actor } from "@src/actor/types";
import { Verb } from "@src/ideology/types";

export interface Action {
  verb: Verb;
  subject?: Actor;
}
