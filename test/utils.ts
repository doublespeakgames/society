import { Judgement, ValueJudgement } from "@src/actor/types";

export const sortJudgements = (judgements:Judgement[]):Judgement[] => {
  judgements.forEach(judgement => judgement.values.sort(judgementSort));
  return judgements;
};

export const judgementSort = (a: ValueJudgement, b: ValueJudgement): number => {
  if (a.value < b.value) {
    return -1;
  }
  if (a.value > b.value) {
    return 1;
  }
  if (a.reason.length < b.reason.length) {
    return -1;
  }
  if (a.reason.length > b.reason.length) {
    return 1;
  }
  return 0;
};
