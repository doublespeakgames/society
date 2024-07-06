import { Actor, ActorConfig, Judgement, Thought } from "./types";
import { uniqueNamesGenerator, Config, names } from 'unique-names-generator';
import { Adjective, Assertion, KeywordAdjective, Noun, SimpleAssertion, SubjectHash } from "@src/ideology/types";
import IdeologyConstructor, { getNoun, getSubjectHash, isValue } from "@src/ideology";

const namesConfig: Config = {
  dictionaries: [names],
}

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
    judge: (actor:Actor) => {
      const thoughts = actor.identities().map<Thought>(subject => ({ subject, reason: [] }));
      const judgements:Judgement[] = [];
      const seenSubjects = new Set<SubjectHash>(thoughts.map(({ subject }) => getSubjectHash(subject)));
      const nouns = new Set<Noun>(thoughts.map(({ subject }) => getNoun(subject)));
      while (thoughts.length > 0) {
        const thought = thoughts.pop();
        if (!thought) {
          break;
        }
        const adjectives = ideology.judge(thought.subject, groups);
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
