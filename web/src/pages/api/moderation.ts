import type { NextApiRequest, NextApiResponse } from "next";
import { PostReviewStatus, Visibility } from "~/server/db/schema/enums";
import { comments, posts } from "~/server/db/schema";

// import { prisma } from "../../server/db/client";
// import { PostReviewStatus, Visibility } from "@prisma/client";
import db from "~/server/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

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
    for (const result of body) {
      const payloadData: {
        autoReviewedAt: Date;
        reviewStatus: PostReviewStatus;
        visibility?: Visibility;
      } = {
        autoReviewedAt: new Date(),
        reviewStatus: result.hasMatch
          ? PostReviewStatus.RejectedAuto
          : PostReviewStatus.Approved,
        visibility: Visibility.Rejected,
      };
      // const payload: {
      //   where: {
      //     id: string;
      //   };
      //   data: {
      //     autoReviewedAt: Date;
      //     reviewStatus: PostReviewStatus;
      //     visibility?: Visibility;
      //   };
      // } = {
      //   where: {
      //     id: result.id,
      //   },
      //   data: {
      //     autoReviewedAt: new Date(),
      //     reviewStatus: result.hasMatch
      //       ? PostReviewStatus.REJECTED_AUTO
      //       : PostReviewStatus.APPROVED,
      //   },
      // };
      // if (result.hasMatch) payload.data.visibility = Visibility.REJECTED;
      // console.log(payload);
      // if (result.type === "COMMENT") await prisma.comment.update(payload);
      if (!result.hasMatch) delete payloadData.visibility;
      if (result.type === "COMMENT")
        await db
          .update(comments)
          .set(payloadData)
          .where(eq(comments.id, result.id));
      else
        await db.update(posts).set(payloadData).where(eq(posts.id, result.id));
    }
    return res.status(200).end();
  }
  return res.status(405).end();
}
