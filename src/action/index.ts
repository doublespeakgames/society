import { Actor, Feeling, Identity } from "@src/actor/types";
import { Action } from "./types";
import { KeywordVerb } from "@src/ideology/types";

const getVerbForFeeling = (feeling:Feeling):KeywordVerb => {
  switch (feeling.value) {
    case 'desired':
      return 'pursue';
    case 'reviled':
      return 'avoid';
    case 'sacred':
      return 'protect';
    case 'feared':
      return 'flee';
    case 'trivial':
      return 'ignore';
  }
}

const ActionConstructor = (
  feeling:Feeling,
  subject:Actor,
  object:Identity|Actor
):Action => ({
  verb: getVerbForFeeling(feeling),
  subject,
  object,
  withEmotion: feeling.value
});

export default ActionConstructor;
