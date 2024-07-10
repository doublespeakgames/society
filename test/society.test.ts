import { describe, it, expect } from "@jest/globals";
import ActorConstructor from "@src/actor";
import { runSociety, GlobalSociety} from '@src/society'

describe("GlobalSociety", () => {
  it("should have a single global context", () => {
    const society = GlobalSociety([]);
    expect([...society]).toStrictEqual([
      { things: [], actions: [] },
    ])
  });
  it("should process actions", () => {
    const subject = ActorConstructor();
    const society = GlobalSociety([subject]);
    const actions = [{ verb: 'ignore', subject }];
    const moreActions = [{ verb: 'avoid', subject }];
    society.processActions(actions);
    expect([...society]).toStrictEqual([
      { things: [subject], actions },
    ]);
    society.processActions(moreActions);
    expect([...society]).toStrictEqual([
      { things: [subject], actions: moreActions },
    ]);
  });
});

describe("runSociety", () => {
  it("should run society", () => {
    const principles = [{ subject: 'people', is: 'reviled' }]
    const subject = ActorConstructor({ principles});
    const society = GlobalSociety([ subject ]);
    expect(runSociety(society)).toStrictEqual([{ 
      verb: 'avoid',
      subject,
      object: subject,
      withEmotion: 'reviled'
    }])
  });
});
