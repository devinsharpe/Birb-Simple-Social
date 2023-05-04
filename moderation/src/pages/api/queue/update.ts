import { NextApiRequest, NextApiResponse } from "next";

import { QueueStatus } from "@prisma/client";
import { prisma } from "../../../server/db/client";
import { z } from "zod";

const bodySchema = z.object({
  id: z.string(),
  text: z.string()
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const body = bodySchema.parse(req.body);
    const result = await prisma.queueItem.update({
      where: {
        id: body.id
      },
      data: {
        text: body.text,
        status: QueueStatus.PENDING
      }
    });
    return res.status(200).json(result);
  }
  return res.status(405).end();
}

export const runtime = "experimental-edge";
