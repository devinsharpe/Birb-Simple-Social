import { ToxicityClassifier } from "@tensorflow-models/toxicity";
import { Tox } from "../types";
import { ResultType } from "@prisma/client";

export default async function classifyText(
  tensorflow: ToxicityClassifier,
  text: string,
  type: ResultType,
  id: string
) {
  const toxicity = (await tensorflow.classify(text)) as unknown as Tox[];
  let hasMatch = false;
  toxicity.forEach((tox) => {
    tox.results.forEach((res) => {
      hasMatch = hasMatch || !!res.match;
    });
  });
  return {
    hasMatch,
    results: toxicity,
    text,
    type,
    id
  };
}
