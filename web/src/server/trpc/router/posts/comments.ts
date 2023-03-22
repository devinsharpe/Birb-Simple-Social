import { protectedProcedure, publicProcedure, router } from "../../trpc";

import { Comment } from "@prisma/client";
import { z } from "zod";

export const commentsRouter = router({
  create: protectedProcedure
    .input(
      z.strictObject({
        postId: z.string(),
        parentId: z.string().optional(),
        text: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findFirst({
        where: {
          id: input.postId,
        },
      });
      let parent: Comment | null = null;
      if (input.parentId) {
        parent = await ctx.prisma.comment.findFirst({
          where: {
            id: input.parentId,
          },
        });
        if (!parent) return null;
      }

      if (post) {
        const comment = await ctx.prisma.comment.create({
          data: {
            text: input.text,
            postId: input.postId,
            profileId: ctx.session.user.id,
            commentId: input.parentId,
          },
        });
        await ctx.prisma.post.update({
          where: { id: input.postId },
          data: {
            commentCount: {
              increment: 1,
            },
          },
        });
        return comment;
      }
      return null;
    }),
  get: protectedProcedure
    .input(
      z.strictObject({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.prisma.comment.findFirst({
        where: {
          id: input.id,
        },
        include: {
          children: {
            include: {
              postedBy: true,
            },
          },
          postedBy: true,
        },
      });
      return comment;
    }),
});
