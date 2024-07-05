import { VALUES } from "@src/constants";
import { Adjective, Assertion, GroupAssertion, Ideology, Judgement, KeywordAdjective, Noun, ResolveTask, SimpleAssertion, Subject, SubjectHash } from "./types"

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

const resolveBeliefs = (
  beliefs:Record<SubjectHash, Adjective[]>,
  tasks:ResolveTask[],
  preJudgements:Judgement[]
):Judgement[] => {
  if (tasks.length === 0) {
    return preJudgements;
  }

  // TODO: dedupe tasks
  const { resolved, toResolve } = tasks
    .map<{ resolved: Judgement[], toResolve: ResolveTask[]}>(({ subject, reason }) => {
      const hash = getSubjectHash(subject);
      const qualities = beliefs[hash] ?? [];
      const resolved = qualities.filter(isValue).map<Judgement>((value) => ({
        value: value as KeywordAdjective,
        reason: [...reason, { subject, is: value }]
      }));
      const toResolve = qualities
        .filter((adjective) => !isValue(adjective))
        .map<ResolveTask>((adjective) => ({ 
          subject: {adjective, noun: getNoun(subject)},
          reason: [...reason, { subject, is: adjective }],
        }));
      return {
        resolved,
        toResolve
      };
    })
    .reduce((acc, { resolved, toResolve }) => ({
      resolved: acc.resolved.concat(resolved),
      toResolve: acc.toResolve.concat(toResolve)
    }), { resolved: [], toResolve: [] });


    return resolveBeliefs(beliefs, toResolve, [...preJudgements, ...resolved]);
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
    judge: (subjectOrSubjects, group) => {
      const subjects = Array.isArray(subjectOrSubjects) ? subjectOrSubjects : [ subjectOrSubjects ];
      const tasks = subjects.map(subject => ({ subject, reason: []}));
      const baseJudgements = resolveBeliefs(beliefs, tasks, []);
      if (!group || !groupBeliefs[group]) {
        return baseJudgements;
      }
      const groupJudgements = resolveBeliefs(groupBeliefs[group], tasks, []);
      return baseJudgements.concat(groupJudgements);
    },
    principles,
    toString: () => JSON.stringify(principles, null, 2)
  };
};

export default IdeologyConstructor;