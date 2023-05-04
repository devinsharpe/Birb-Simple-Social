import { NextApiRequest, NextApiResponse } from "next";

import { QueueStatus } from "@prisma/client";
import classifyText from "../../../../utils/classify/text";
import createResult from "../../../../utils/result/create";
import { env } from "../../../../env/server.mjs";
import { prisma } from "../../../../server/db/client";
import txjs from "../../../../server/tensorflow";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const amt = parseInt(req.query.amt as string, 10);
    const items = await prisma.queueItem.findMany({
      where: {
        status: QueueStatus.PENDING
      },
      orderBy: {
        updatedAt: "asc"
      },
      take: amt
    });
    const tensorflow = await txjs;
    const promises = items.map((item) =>
      classifyText(tensorflow, item.text, item.type, item.id)
    );
    const toxResults = await Promise.all(promises);
    const results = await createResult(toxResults);
    if (results.length)
      await fetch(`${env.APP_URL}/api/moderation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(
          results.map((result) => ({
            id: result.id,
            type: result.type,
            hasMatch: result.hasMatch
          }))
        )
      });
    await prisma.queueItem.updateMany({
      where: {
        id: {
          in: items.map((item) => item.id)
        }
      },
      data: {
        status: QueueStatus.COMPLETED
      }
    });
    return res.status(200).end();
  }
  return res.status(405).end();
}
