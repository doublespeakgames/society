import { getSubjectHash } from "@src/ideology";
import { Thought } from "./types";
import { SubjectHash } from "@src/ideology/types";

const ThoughtStack = (initial:Thought[] = []) => {
  const stack = [...initial];
  const seenSubjects = new Set<SubjectHash>(stack.map(({ subject }) => getSubjectHash(subject)));

  return {
    pop: () => stack.pop(),
    push: (...thoughts:Thought[]) => {
      for (const thought of thoughts) {
        const hash = getSubjectHash(thought.subject);
        if (!seenSubjects.has(hash)) {
          seenSubjects.add(hash);
          stack.push(thought);
        }
      }
    },
    isEmpty: () => stack.length === 0
  };
};

export default ThoughtStack;
