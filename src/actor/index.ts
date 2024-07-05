import { Actor } from "./types";
import { uniqueNamesGenerator, Config, names } from 'unique-names-generator';
import { Adjective, Assertion } from "@src/ideology/types";
import IdeologyConstructor from "@src/ideology";

const namesConfig: Config = {
  dictionaries: [names],
}

const ActorConstructor = (principles:Assertion[], attributes:Adjective[] = []):Actor => {
  const name = uniqueNamesGenerator(namesConfig);
  const ideology = IdeologyConstructor(principles);
  const attrs = new Set(attributes);
  return {
    name,
    ideology,
    attributes: attrs,
    groups: new Set(['people']),
    judge: (actor:Actor) => {
      const groups = [ ...actor.groups ];
      const identities = groups.flatMap(
        group => [...actor.attributes].map(attr => ({ 
          adjective: attr,
          noun: group
        }))
      );
      const subjects = [
        ...groups,
        ...identities
      ];
      return ideology.judge(subjects);
    },
    toString: () => `
      Name: ${name}
      Ideology: ${ideology.toString()}
      Attributes: ${JSON.stringify(attrs, null, 2)}
    `
  };
};

export default ActorConstructor;
