import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { prisma } from "../../server/db/client";
import { PostReviewStatus, Visibility } from "@prisma/client";

const bodySchema = z.array(
  z.object({
    id: z.string(),
    type: z.enum(["COMMENT", "POST"]).default("POST"),
    hasMatch: z.boolean(),
  })
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const body = bodySchema.parse(req.body);
    console.log(body);
    for (const result of body) {
      const payload: {
        where: {
          id: string;
        };
        data: {
          autoReviewedAt: Date;
          reviewStatus: PostReviewStatus;
          visibility?: Visibility;
        };
      } = {
        where: {
          id: result.id,
        },
        data: {
          autoReviewedAt: new Date(),
          reviewStatus: result.hasMatch
            ? PostReviewStatus.REJECTED_AUTO
            : PostReviewStatus.APPROVED,
        },
      };
      if (result.hasMatch) payload.data.visibility = Visibility.REJECTED;
      console.log(payload);
      if (result.type === "COMMENT") await prisma.comment.update(payload);
      else await prisma.post.update(payload);
    }
    return res.status(200).end();
  }
  return res.status(405).end();
}
