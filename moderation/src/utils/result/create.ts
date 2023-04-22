import { Tox } from "../types";

import { prisma } from "../../server/db/client";
import { ResultType } from "@prisma/client";
import { env } from "../../env/server.mjs";

interface ToxArg {
  hasMatch: boolean;
  id: string;
  results: Tox[];
  text: string;
  type: ResultType;
}

export default async function createResult(toxResults: ToxArg[]) {
  for (const tox of toxResults) {
    const result = await prisma.result.create({
      data: {
        id: tox.id,
        hasMatch: tox.hasMatch,
        text: tox.text,
        type: tox.type,
        threshold: env.TOXICITY_THRESHOLD
      }
    });
    await prisma.probability.createMany({
      data: tox.results.map((t) => ({
        label: t.label,
        match: !!t.results[0].match,
        confidence: t.results[0].probabilities[1],
        resultId: tox.id
      }))
    });
  }
  return prisma.result.findMany({
    where: {
      id: {
        in: toxResults.map((tox) => tox.id)
      }
    },
    include: {
      probabilities: true
    }
  });
}
