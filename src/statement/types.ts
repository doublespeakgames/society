export type KeywordVerb = "take" | "give";
export type KeywordNoun = "people";
export type KeywordAdjective = "desired";
export type Noun = KeywordNoun | string;
export type Verb = KeywordVerb | string;
export type Adjective = KeywordAdjective | string;
export interface Action {
  subject: Noun;
  object: Noun;
  verb: Verb;
}

export interface Assignment {
  subject: Noun;
  is: Noun | Adjective;
}
