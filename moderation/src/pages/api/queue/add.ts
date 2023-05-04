import { NextApiRequest, NextApiResponse } from "next";

import { ResultType } from "@prisma/client";
import { prisma } from "../../../server/db/client";
import { z } from "zod";

const bodySchema = z.array(
  z.object({
    id: z.string(),
    text: z.string(),
    type: z
      .enum([ResultType.COMMENT, ResultType.FORM, ResultType.POST])
      .default(ResultType.POST)
  })
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string[]>
) {
  if (req.method === "POST") {
    const body = bodySchema.parse(req.body);
    await prisma.queueItem.createMany({ data: body });
    const result = await prisma.queueItem.findMany({
      where: {
        id: {
          in: body.map((x) => x.id)
        }
      }
    });
    return res.status(200).json(result.map((queueItem) => queueItem.id));
  }
  return res.status(405).end();
}

export const runtime = "experimental-edge";
