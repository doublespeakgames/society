import { describe, it, expect } from "@jest/globals";
import ActionConstructor from "@src/action";
import ActorConstructor from "@src/actor";
import { Feeling } from "@src/actor/types";
import { KeywordAdjective, KeywordVerb } from "@src/ideology/types";

describe("Action", () => {
  it.each<[KeywordAdjective, KeywordVerb]>([
    ["desired", "pursue"],
    ["reviled", "avoid"],
    ["sacred", "protect"],
    ["feared", "flee"],
    ["trivial", "ignore"]
  ])("should be constructable from a %s feeling", (value, verb) => {
    const subject = ActorConstructor();
    const object = 'bunny';
    const feeling:Feeling = { subject, value, strength: 1 }
    const action = ActionConstructor(feeling, subject, object);
  expect(action).toStrictEqual({
      verb,
      subject,
      object,
      withEmotion: value
    });
  });
});
