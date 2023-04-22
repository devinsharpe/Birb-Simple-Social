import { NextApiRequest, NextApiResponse } from "next";
import txjs from "../../../server/tensorflow";
import { prisma } from "../../../server/db/client";
import { ResultType } from "@prisma/client";
import type { Result, Probability } from "@prisma/client";
import { z } from "zod";
import classifyText from "../../../utils/classify/text";
import createResult from "../../../utils/result/create";

const bodySchema = z.object({
  id: z.string(),
  text: z.string(),
  type: z
    .enum([ResultType.COMMENT, ResultType.FORM, ResultType.POST])
    .default(ResultType.POST)
});

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
    const toxicity = await classifyText(
      tensorflow,
      body.text,
      body.type,
      body.id
    );
    const results = await createResult([toxicity]);
    const result = results[0];
    if (!result) throw new Error("Result not found");
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
