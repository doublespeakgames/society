import { VALUES } from "@src/constants";
import {
  Adjective,
  Assertion,
  CompoundNoun,
  GroupAssertion,
  Ideology,
  Infinitive,
  Noun,
  SimpleAssertion,
  Subject,
  SubjectHash
} from "./types"

export const getSubjectHash = (subject:Subject):string => {
  if (isNoun(subject)) {
    return subject as Noun;
  }
  if (isCompoundNoun(subject)) {
    const { adjective, noun } = subject as CompoundNoun;
    return `[${adjective}] ${noun}`;
  }
  if (isInfinitive(subject)) {
    const { to } = subject as Infinitive;
    return `<to ${to}>`;
  }
  throw new Error("Unknown subject type");
};

export const isNoun = (subject:Subject):boolean =>  typeof subject === "string";

export const isCompoundNoun = (subject:Subject):boolean => 
  typeof subject === 'object' && 'adjective' in subject;

export const isInfinitive = (subject:Subject):boolean => 
  typeof subject === 'object' && 'to' in subject;

export const values:Set<Adjective> = new Set(VALUES);
export const isValue = (adjective:Adjective):boolean => values.has(adjective);

const isSimpleAssertion = (assertion:Assertion):boolean => 'is' in assertion;
const isGroupAssertion = (assertion:Assertion):boolean => 'group' in assertion;

const parseAssertions = (assertions:SimpleAssertion[]):Record<SubjectHash, Adjective[]> => {
  const beliefs:Record<SubjectHash, Adjective[]> = {};
  assertions.forEach(({subject, is}) => {
    const subjectHash = getSubjectHash(subject);
    if (!beliefs[subjectHash]) {
      beliefs[subjectHash] = [];
    }
    beliefs[subjectHash].push(is);
  });
  return beliefs;
};

const IdeologyConstructor = (principles:Assertion[]):Ideology => {

  const simpleAssertions:SimpleAssertion[] = [];
  const groupAssertions:Record<Noun, SimpleAssertion[]> = {};
  for (const principle of principles) {
    if (isSimpleAssertion(principle)) {
      simpleAssertions.push(principle as SimpleAssertion);
    }
    else if (isGroupAssertion(principle)) {
      const { group, believe } = principle as GroupAssertion;
      if (!groupAssertions[group]) {
        groupAssertions[group] = [];
      }
      groupAssertions[group].push(...Array.isArray(believe) ? believe : [believe]);
    }
  }

  const beliefs:Record<SubjectHash, Adjective[]> = parseAssertions(simpleAssertions);
  const groupBeliefs:Record<Noun, Record<SubjectHash, Adjective[]>> = Object.fromEntries(Object
    .entries(groupAssertions)
    .map(([group, assertions]) => [group, parseAssertions(assertions)]));
  return {
    assert: (assertion) => {
      // TODO
      throw new Error("Not implemented");
    },
    judge: (subject, group) => {
      const hash = getSubjectHash(subject);
      if (group) {
        return (groupBeliefs[group] ?? {})[hash] ?? [];
      }
      return beliefs[hash] ?? [];
    },
    principles,
    toString: () => JSON.stringify(principles, null, 2)
  };
};

export default IdeologyConstructor;