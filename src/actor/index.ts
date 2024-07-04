import { Society } from "@src/society/types";
import { Actor } from "./types";
import { uniqueNamesGenerator, Config, names } from 'unique-names-generator';
import { Adjective } from "@src/ideology/types";

const namesConfig: Config = {
  dictionaries: [names],
}

const ActorConstructor = (society:Society, attributes:Adjective[] = []):Actor => {
  const name = uniqueNamesGenerator(namesConfig);
  const ideology = society.ideology.copy();
  const attrs = new Set(attributes);
  return {
    name,
    ideology,
    attributes: attrs,
    groups: new Set('people'),
    judge: (actor:Actor) => {
      const groups = [ ...actor.groups ];
      const identities = groups.flatMap(
        group => attributes.map(attr => ({ 
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
