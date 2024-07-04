import { VALUES } from "@src/constants";
import { Adjective, Assertion, Ideology, Judgement, KeywordAdjective, Noun, ResolveTask, Subject } from "./types"

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

const parseAssertions = (principles:Assertion[]):Record<string, Adjective[]> => {
  const beliefs:Record<string, Adjective[]> = {};
  principles.forEach(({subject, is}) => {
    const subjectHash = getSubjectHash(subject);
    if (!beliefs[subjectHash]) {
      beliefs[subjectHash] = [];
    }
    beliefs[subjectHash].push(is);
  });
  return beliefs;
};

const resolveBeliefs = (
  beliefs:Record<string, Adjective[]>,
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
      const principles = beliefs[hash] ?? [];
      const resolved = principles.filter(isValue).map<Judgement>((value) => ({
        value: value as KeywordAdjective,
        reason: [...reason, { subject, is: value }]
      }));
      const toResolve = principles
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
  const beliefs:Record<string, Adjective[]> = parseAssertions(principles);
  return {
    assert: (assertion) => {
      // TODO
      throw new Error("Not implemented");
    },
    judge: (subject) => {
      const tasks = [{ subject, reason: []}];
      if (typeof subject !== 'string') {
        tasks.unshift({ subject: subject.noun, reason: [] });
      }
      return resolveBeliefs(beliefs, tasks, []);
    }
  };
};

export default IdeologyConstructor;