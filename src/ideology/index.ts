import { VALUES } from "@src/constants";
import {
  Adjective,
  Assertion,
  GroupAssertion,
  Ideology,
  KeywordAdjective,
  Noun,
  ResolveTask,
  SimpleAssertion,
  Subject,
  SubjectHash
} from "./types"

export const getSubjectHash = (subject:Subject):string => {
  if (typeof subject === "string") {
    return subject;
  }
  return `[${subject.adjective}] ${subject.noun}`;
};

export const getNoun = (subject:Subject):Noun =>
  typeof subject === "string" ? subject : subject.noun;

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

const mergeBeliefs = (
  baseBeliefs:Record<SubjectHash, Adjective[]>,
  groupBeliefs:Record<SubjectHash, Adjective[]>[]
):Record<SubjectHash, Adjective[]> => {
  const mergedBeliefs:Record<SubjectHash, Adjective[]> = {};
  for (const [hash, adjectives] of Object.entries(baseBeliefs)) {
    mergedBeliefs[hash] = [...adjectives];
  }
  for (const beliefs of groupBeliefs) {
    // Note: When beliefs conflict, it could be fun to resolve it randomly...
    for (const [hash, adjectives] of Object.entries(beliefs)) {
      if (!mergedBeliefs[hash]) {
        mergedBeliefs[hash] = [];
      }
      mergedBeliefs[hash].push(...adjectives);
    }
  }
  return mergedBeliefs;
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
    judge: (subject, groups) => {
      const fullBeliefs = groups ? mergeBeliefs(beliefs, groups.map(group => groupBeliefs[group])) : beliefs;
      return fullBeliefs[getSubjectHash(subject)] ?? [];
    },
    principles,
    toString: () => JSON.stringify(principles, null, 2)
  };
};

export default IdeologyConstructor;