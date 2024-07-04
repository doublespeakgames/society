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
    toString: () => `
      Name: ${name}
      Ideology: ${ideology.toString()}
      Attributes: ${JSON.stringify(attrs, null, 2)}
    `
  };
};

export default ActorConstructor;
