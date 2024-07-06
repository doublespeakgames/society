import { Actor, ActorConfig, Identity, Judgement, Thought } from "./types";
import { uniqueNamesGenerator, Config, names } from 'unique-names-generator';
import { Adjective, Ideology, KeywordAdjective, Noun, SimpleAssertion, Subject, SubjectHash } from "@src/ideology/types";
import IdeologyConstructor, { getSubjectHash, isCompoundNoun, isNoun, isValue } from "@src/ideology";

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

const judgeWithGroups = (ideology:Ideology, subject:Subject, groups:Noun[]):Adjective[] => {
  const adjectives = ideology.judge(subject);
  for (const group of groups) {
    adjectives.push(...ideology.judge(subject, group));
  }
  return adjectives;
};

const ActorConstructor = ({
  name = uniqueNamesGenerator(namesConfig),
  principles = [],
  attributes = [],
  groups = [],
}:ActorConfig):Actor => {
  const ideology = IdeologyConstructor(principles);
  return {
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
    judge: (actor, doing) => {
      const identities = getIdentities(actor);
      const thoughts = identities.map<Thought>(subject => ({ subject, reason: [] }));
      const judgements:Judgement[] = [];
      const seenSubjects = new Set<SubjectHash>(identities.map(getSubjectHash));
      const nouns = new Set<Noun>(identities.map(getBaseIdentity));
      const addAdjective = (adjective:Adjective, reason:SimpleAssertion[]) => {
        for (const noun of nouns) {
          const newSubject = { adjective, noun };
          const newHash = getSubjectHash(newSubject);
          if (!seenSubjects.has(newHash)) {
            seenSubjects.add(newHash)
            thoughts.push({
              subject: newSubject,
              reason
            });
          }
        }
      };

      if (doing) {
        const infinitive = { to: doing.verb };
        for (const actionAdjective of judgeWithGroups(ideology, infinitive, groups)) {
          addAdjective(actionAdjective, [{
            subject: infinitive,
            is: actionAdjective
          }]);
        }
      }
      while (thoughts.length > 0) {
        const thought = thoughts.pop();
        if (!thought) {
          break;
        }
        const adjectives = judgeWithGroups(ideology, thought.subject, groups);
        for (const adjective of adjectives) {
          const reason = thought.reason.concat({
            subject: thought.subject,
            is: adjective
          });
          if (isValue(adjective)) {
            judgements.push({
              value: adjective as KeywordAdjective,
              reason
            });
          }
          else {
            addAdjective(adjective, reason);
          }
        }
      }
      return judgements;
    },
    toString: () => `
      Name: ${name}
      Ideology: ${ideology.toString()}
      Attributes: ${JSON.stringify(attributes, null, 2)}
    `
  };
};

export default ActorConstructor;
