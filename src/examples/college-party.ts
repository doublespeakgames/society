import { actionString } from "@src/action";
import ActorConstructor from "@src/actor";
import { Actor } from "@src/actor/types";
import { Adjective, Assertion, Noun } from "@src/ideology/types";
import { GlobalSociety, runSociety } from "@src/society";
import { arrayOf } from "@src/utils";

const fraternityPrinciples = [
  { subject: { adjective: 'pretty', noun: 'femalepresenting' }, is: 'desired' },
  { subject: { to: 'pursue' }, is: 'desired' },
];

const sororityPrinciples = [
  { subject: { adjective: 'pretty', noun: 'malepresenting' }, is: 'desired' },
  { subject: { to: 'pursue' }, is: 'desired' },
];

const partierPrinciples = [
  { subject: { to: 'pursue' }, is: 'desired' },
];

const weirdoPrinciples = [
  { subject: { to: 'pursue' }, is: 'feared' }
];

const principles = [
  { group: 'fratboys', believe: fraternityPrinciples },
  { group: 'soriritygirls', believe: sororityPrinciples },
  { group: 'partiers', believe: partierPrinciples },
  { group: 'weirdos', believe: weirdoPrinciples },
];

const actors = arrayOf(10, () => {
  const attributes:Adjective[] = [];
  const presenting = Math.random() < 0.5 ? 'malepresenting' : 'femalepresenting';
  const groups:Noun[] = [ presenting ];
  if (Math.random() < 0.3) {
    groups.push(presenting === 'malepresenting' ? 'fratboys' : 'sororitygirls');
  }
  if (Math.random() < 0.4) {
    groups.push('partiers');
  }
  if (Math.random() < 0.2) {
    groups.push('weirdos');
  }
  if (Math.random() < 0.3) {
    attributes.push('pretty');
  }
  return ActorConstructor({ principles, attributes, groups });
});

const party = GlobalSociety(actors);

const keypress = async () => {
  process.stdin.setRawMode(true)
  return new Promise<void>(resolve => process.stdin.once('data', data => {
    const byteArray = [...data]
    if (byteArray.length > 0 && byteArray[0] === 3) {
      process.exit(0)
    }
    process.stdin.setRawMode(false)
    resolve()
  }))
}

while (true) {
  let context = [...party][0];
  console.log('==== Partiers ====');
  console.log(context.things.map((thing) => thing.toString()));
  console.log('==== Actions ====');
  console.log((context.actions ?? []).map((action) => actionString(action)));
  await keypress();
  party.processActions(runSociety(party));
}