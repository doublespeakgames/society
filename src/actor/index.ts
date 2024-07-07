import { Actor, ActorConfig, ActorId, Identity, Judgement, Thought } from "./types";
import { uniqueNamesGenerator, Config, names } from 'unique-names-generator';
import { Adjective, Assertion, Ideology, KeywordAdjective, Noun, SimpleAssertion, Subject, SubjectHash } from "@src/ideology/types";
import IdeologyConstructor, { getSubjectHash, isCompoundNoun, isNoun, isValue } from "@src/ideology";
import { v4 as uuid } from 'uuid';
import ThoughtStack from "./thought-stack";

const namesConfig: Config = {
  dictionaries: [names],
};

export const getBaseIdentity = (identity:Identity):Noun =>
  typeof identity === "string" ? identity : identity.noun;

const getIdentities = (subject:Actor | Identity):Identity[] => {
  if (typeof subject === 'object' && 'judge' in subject) {
    // Actor
    return subject.identities();
  }
  const baseIdentity = getBaseIdentity(subject);
  return baseIdentity === subject ? [subject] : [baseIdentity, subject];
}

const judgeWithGroups = (ideology:Ideology, subject:Subject, groups:Noun[]):[Adjective, Noun | null][] => {
  const adjectives = ideology.judge(subject).map<[Adjective, Noun | null]>(adjective => [adjective, null]);
  for (const group of groups) {
    adjectives.push(...ideology.judge(subject, group).map<[Adjective, Noun | null]>(adjective => [adjective, group]));
  }
  return adjectives;
};

const getThingHash = (thing:Identity | Actor):string => {
  if (typeof thing === 'object' && 'judge' in thing) {
    // Actor
    return thing.id;
  }
  return getSubjectHash(thing);
};

const ActorConstructor = ({
  name = uniqueNamesGenerator(namesConfig),
  principles = [],
  attributes = [],
  groups = [],
}:ActorConfig):Actor => {
  const ideology = IdeologyConstructor(principles);
  return {
    id: uuid(),
    name,
    ideology,
    identities: () => {
      const allGroups = ['people', ...groups];
      const identities = allGroups.flatMap(
        group => attributes.map(attr => ({ 
          adjective: attr,
          noun: group
        }))
      );
      return [
        ...allGroups,
        ...identities
      ];
    },
    judge: ({ things, actions = [] }) => {
      return things.map(thing => {
        const identities = getIdentities(thing);
        const thoughts = ThoughtStack(identities.map<Thought>(subject => ({ subject, reason: [] })));
        const nouns = new Set<Noun>(identities.map(getBaseIdentity));
        const takingActions = actions.filter(({ subject }) => subject === thing);
        const judgement:Judgement = { thing, values: [] };
        for (const { verb } of takingActions) {
          const infinitive = { to: verb };
          for (const [actionAdjective, group] of judgeWithGroups(ideology, infinitive, groups)) {
            const assertion = { subject: infinitive, is: actionAdjective };
            const reason = [group ? { group, believe: assertion } : assertion];
            for (const noun of nouns) {
              thoughts.push({ subject: { adjective: actionAdjective, noun }, reason });
            }
          }
        }
        while (!thoughts.isEmpty()) {
          const thought = thoughts.pop();
          if (!thought) {
            break;
          }
          const adjectives = judgeWithGroups(ideology, thought.subject, groups);
          for (const [adjective, group] of adjectives) {
            const assertion = { subject: thought.subject, is: adjective };
            const reason = thought.reason.concat(group 
              ? { group, believe: assertion } 
              : assertion);
            if (isValue(adjective)) {
              judgement.values.push({
                value: adjective as KeywordAdjective,
                reason
              });
            }
            else {
              for (const noun of nouns) {
                thoughts.push({ subject: { adjective, noun }, reason });
              }
            }
          }
        }
        return judgement;
      });
    },
    toString: () => `
      Name: ${name}
      Ideology: ${ideology.toString()}
      Attributes: ${JSON.stringify(attributes, null, 2)}
    `
  };
};

export default ActorConstructor;
