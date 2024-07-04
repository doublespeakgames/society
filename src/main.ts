import { Assertion } from "./ideology/types";
import SocietyConstructor from "./society";

const principles:Assertion[] = [
  { subject: 'freedom', is: 'desired' },
  { subject: 'people', is: 'feared' },
  { subject: 'money', is: 'sacred' }
];
const society = SocietyConstructor(principles, 10);
console.log(society.toString());

