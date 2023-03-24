import { NextApiRequest, NextApiResponse } from "next";
import txjs from "../../../server/tensorflow";
import { prisma } from "../../../server/db/client";
import { ResultType } from "@prisma/client";
import type { Result, Probability } from "@prisma/client";
import { z } from "zod";
import { env } from "../../../env/server.mjs";

const bodySchema = z.object({
  id: z.string().optional(),
  text: z.string(),
  type: z
    .enum([ResultType.COMMENT, ResultType.FORM, ResultType.POST])
    .default(ResultType.POST)
});

interface Tox {
  label: string;
  results: [ToxResult, ...ToxResult[]];
}

interface ToxResult {
  match: boolean | null;
  probabilities: [number, number];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | (Result & {
        probabilities: Probability[];
      })
    | null
  >
) {
  if (req.method === "POST") {
    const body = bodySchema.parse(req.body);
    const tensorflow = await txjs;
    const toxicity = (await tensorflow.classify(
      req.body.text
    )) as unknown as Tox[];
    let hasMatch = false;
    toxicity.forEach((tox) => {
      tox.results.forEach((res) => {
        hasMatch = hasMatch || !!res.match;
      });
    });
    const result = await prisma.result.create({
      data: {
        hasMatch,
        text: body.text,
        type: body.type,
        threshold: env.TOXICITY_THRESHOLD
      }
    });
    await prisma.probability.createMany({
      data: toxicity.map((tox) => ({
        label: tox.label,
        match: !!tox.results[0].match,
        confidence: tox.results[0].probabilities[1],
        resultId: result.id
      }))
    });
    const responseBody = await prisma.result.findFirst({
      where: {
        id: result.id
      },
      include: {
        probabilities: true
      }
    });
    return res.status(200).json(responseBody);
  }
  return res.status(405).end();
}
