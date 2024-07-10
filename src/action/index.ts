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

const objectString = (object?:Identity|Actor):string => {
  if (!object) {
    return 'nothing';
  }
  if (typeof object === 'object' && 'name' in object) {
    return object.name;
  }
  if (typeof object === 'string') {
    return object;
  }
  return `${object.adjective} ${object.noun}`;
}

export const actionString = ({ verb, subject, object, withEmotion }:Action) => JSON.stringify({
  verb,
  subject: subject.name,
  object: objectString(object),
  withEmotion
})

const ActionConstructor = (
  feeling:Feeling,
  subject:Actor,
  object:Identity|Actor
):Action => {
  const verb = getVerbForFeeling(feeling);
  return {
    verb,
    subject,
    object,
    withEmotion: feeling.value
  };
};

export default ActionConstructor;
