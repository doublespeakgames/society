import { Judgement } from "@src/actor/types";

export const judgementSort = (a: Judgement, b: Judgement): number => {
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
