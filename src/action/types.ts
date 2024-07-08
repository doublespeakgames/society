import { Actor, Identity } from "@src/actor/types";
import { KeywordAdjective, Verb } from "@src/ideology/types";

export interface Action {
  verb: Verb;
  subject: Actor;
  object?: Identity | Actor;
  withEmotion?: KeywordAdjective;
}
